import { redirect } from "next/navigation";

export default function TestDetailsRedirect(props: any) {
  redirect(`/college/tests/${props.params.id}/builder`);
}

