import { UsersList } from "@/features/users/presentation/components/users-list";

export default function UsersPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto bg-white rounded-md p-6 my-6">
      <UsersList />
    </div>
  );
}
