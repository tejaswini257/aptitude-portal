import { redirect } from "next/navigation";

export default async function TestDetailsRedirect(props: any) {
  const params = await props.params;
  redirect(`/college/tests/${params.id}/builder`);
}

