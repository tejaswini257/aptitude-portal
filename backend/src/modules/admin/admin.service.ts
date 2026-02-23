import { Injectable, OnModuleInit } from '@nestjs/common';
import { OrgType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type MonitoringEvent = {
  id: string;
  userId: string;
  orgId: string;
  orgType: string;
  cameraActive: boolean;
  audioActive: boolean;
  tabSwitched: boolean;
  warningCount: number;
  maxWarningsAllowed: number;
  timestamp: string;
};

type RolePermissionRecord = {
  role: string;
  permissions: string[];
  updatedAt: string;
};

type SubscriptionRecord = {
  orgId: string;
  validityDays: number;
  updatedAt: string;
};

const DEFAULT_VALIDITY_DAYS = 365;

const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    'dashboard:view',
    'users:manage',
    'roles:manage',
    'subscriptions:manage',
    'analytics:view',
    'monitoring:view',
    'orgs:manage',
  ],
  COLLEGE_ADMIN: [
    'dashboard:view',
    'students:manage',
    'tests:manage',
    'analytics:view',
    'drives:view',
  ],
  COMPANY_ADMIN: [
    'dashboard:view',
    'tests:manage',
    'drives:manage',
    'questions:manage',
    'analytics:view',
  ],
  STUDENT: [
    'dashboard:view',
    'tests:attempt',
    'practice:attempt',
    'coding:attempt',
    'analytics:view',
  ],
};

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    await this.ensureAdminTables();
  }

  private async ensureAdminTables() {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role TEXT PRIMARY KEY,
        permissions JSONB NOT NULL,
        updated_by TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS subscription_configs (
        org_id TEXT PRIMARY KEY,
        validity_days INT NOT NULL,
        updated_by TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS blocked_users (
        user_id TEXT PRIMARY KEY,
        reason TEXT,
        blocked_by TEXT,
        blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async getDashboardStats() {
    const [colleges, companies, students] = await Promise.all([
      this.prisma.college.count(),
      this.prisma.organization.count({ where: { type: OrgType.COMPANY } }),
      this.prisma.student.count(),
    ]);

    return { colleges, companies, students };
  }

  async getRolePermissions() {
    const rows = await this.prisma.$queryRawUnsafe<
      Array<{ role: string; permissions: unknown; updated_at: Date }>
    >(`
      SELECT role, permissions, updated_at
      FROM role_permissions
    `);

    const stored = new Map<string, RolePermissionRecord>();
    rows.forEach((row) => {
      const parsed = Array.isArray(row.permissions)
        ? (row.permissions as string[])
        : [];
      stored.set(row.role, {
        role: row.role,
        permissions: parsed,
        updatedAt: row.updated_at.toISOString(),
      });
    });

    return Object.values(UserRole).map((role) => {
      const found = stored.get(role);
      return {
        role,
        permissions: found?.permissions ?? DEFAULT_ROLE_PERMISSIONS[role],
        updatedAt: found?.updatedAt ?? null,
      };
    });
  }

  async updateRolePermissions(
    role: UserRole,
    permissions: string[],
    updatedBy: string,
  ) {
    const payload = JSON.stringify(permissions);
    await this.prisma.$executeRawUnsafe(
      `
        INSERT INTO role_permissions (role, permissions, updated_by, updated_at)
        VALUES ($1, $2::jsonb, $3, NOW())
        ON CONFLICT (role)
        DO UPDATE
        SET permissions = EXCLUDED.permissions,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
      `,
      role,
      payload,
      updatedBy,
    );

    return { role, permissions, message: 'Permissions updated successfully' };
  }

  async getSubscriptions() {
    const organizations = await this.prisma.organization.findMany({
      where: {
        type: {
          in: [OrgType.COLLEGE, OrgType.COMPANY],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const configs = await this.prisma.$queryRawUnsafe<
      Array<{ org_id: string; validity_days: number; updated_at: Date }>
    >(`
      SELECT org_id, validity_days, updated_at
      FROM subscription_configs
    `);

    const configMap = new Map<string, SubscriptionRecord>();
    configs.forEach((config) => {
      configMap.set(config.org_id, {
        orgId: config.org_id,
        validityDays: config.validity_days,
        updatedAt: config.updated_at.toISOString(),
      });
    });

    const now = Date.now();
    return organizations.map((org) => {
      const config = configMap.get(org.id);
      const validityDays = config?.validityDays ?? DEFAULT_VALIDITY_DAYS;
      const expiryDate = new Date(org.createdAt);
      expiryDate.setDate(expiryDate.getDate() + validityDays);
      const isExpired = expiryDate.getTime() < now;

      return {
        orgId: org.id,
        orgName: org.name,
        orgType: org.type,
        createdAt: org.createdAt,
        validityDays,
        expiryDate: expiryDate.toISOString(),
        status: isExpired ? 'EXPIRED' : 'ACTIVE',
        updatedAt: config?.updatedAt ?? null,
      };
    });
  }

  async updateSubscription(
    orgId: string,
    validityDays: number,
    updatedBy: string,
  ) {
    await this.prisma.organization.findUniqueOrThrow({ where: { id: orgId } });
    await this.prisma.$executeRawUnsafe(
      `
        INSERT INTO subscription_configs (org_id, validity_days, updated_by, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (org_id)
        DO UPDATE
        SET validity_days = EXCLUDED.validity_days,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
      `,
      orgId,
      validityDays,
      updatedBy,
    );

    return {
      message: 'Subscription updated successfully',
      orgId,
      validityDays,
    };
  }

  async getMonitoringOverview() {
    const [users, organizations, tests, submissions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organization.count(),
      this.prisma.test.count(),
      this.prisma.submission.count(),
    ]);

    let events: MonitoringEvent[] = [];
    try {
      const latest = await this.prisma.proctoringEvent.findMany({
        orderBy: { timestamp: 'desc' },
        take: 20,
      });

      events = latest.map((event) => ({
        id: event.id,
        userId: event.userId,
        orgId: event.orgId,
        orgType: event.orgType,
        cameraActive: event.cameraActive,
        audioActive: event.audioActive,
        tabSwitched: event.tabSwitched,
        warningCount: event.warningCount,
        maxWarningsAllowed: event.maxWarningsAllowed,
        timestamp: event.timestamp.toISOString(),
      }));
    } catch {
      events = [];
    }

    return {
      summary: { users, organizations, tests, submissions },
      proctoringEvents: events,
      checkedAt: new Date().toISOString(),
    };
  }

  async getUsersWithBlockStatus() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        organization: {
          select: { name: true, type: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const blockedRecords = await this.prisma.$queryRawUnsafe<Array<{ user_id: string, reason: string, blocked_at: Date }>>(
      `SELECT user_id, reason, blocked_at FROM blocked_users`
    );
    const blockedMap = new Map();
    blockedRecords.forEach(r => blockedMap.set(r.user_id, r));

    return users.map(user => {
      const blockInfo = blockedMap.get(user.id);
      return {
        ...user,
        organizationName: user.organization?.name || 'Platform',
        isBlocked: !!blockInfo,
        blockReason: blockInfo?.reason || null,
        blockedAt: blockInfo?.blocked_at || null,
      };
    });
  }

  async blockUser(userId: string, reason: string, blockedBy: string) {
    await this.prisma.$executeRawUnsafe(
      `
        INSERT INTO blocked_users (user_id, reason, blocked_by, blocked_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id) DO UPDATE SET 
          reason = EXCLUDED.reason,
          blocked_by = EXCLUDED.blocked_by,
          blocked_at = NOW()
      `,
      userId,
      reason,
      blockedBy
    );
    return { success: true, message: 'User blocked successfully' };
  }

  async unblockUser(userId: string) {
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM blocked_users WHERE user_id = $1`,
      userId
    );
    return { success: true, message: 'User unblocked successfully' };
  }
}
