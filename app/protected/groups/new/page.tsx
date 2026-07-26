import { GroupCreateForm } from "@/components/group-create-form";
import { ProtectedTabs } from "@/components/protected-tabs";

export default function NewGroupPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-10 pb-20">
      <GroupCreateForm />
      <ProtectedTabs />
    </div>
  );
}
