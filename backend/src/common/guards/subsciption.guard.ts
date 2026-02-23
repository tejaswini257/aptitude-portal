import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_VALIDITY_DAYS = 365;

@Injectable()
export class SubsciptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { orgId?: string; role?: UserRole };
      method?: string;
    }>();

    const method = (request.method || 'GET').toUpperCase();
    const isReadOnly =
      method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
    if (isReadOnly) {
      return true;
    }

    const role = request.user?.role;
    if (role !== UserRole.COMPANY_ADMIN && role !== UserRole.COLLEGE_ADMIN) {
      return true;
    }

    const orgId = request.user?.orgId;
    if (!orgId) {
      throw new ForbiddenException('Organization not found for this account');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { createdAt: true },
    });

    if (!organization) {
      throw new ForbiddenException('Organization not found');
    }

    const configRows: Array<{ validity_days: number }> =
      await this.prisma.$queryRawUnsafe(
        `
        SELECT validity_days
        FROM subscription_configs
        WHERE org_id = $1
        LIMIT 1
        `,
        orgId,
      );

    const validityDays = configRows[0]?.validity_days ?? DEFAULT_VALIDITY_DAYS;
    const expiryDate = new Date(organization.createdAt);
    expiryDate.setDate(expiryDate.getDate() + validityDays);

    if (expiryDate.getTime() < Date.now()) {
      throw new ForbiddenException(
        'Subscription expired. This account is in view-only mode.',
      );
    }

    return true;
  }
}
