import ProfilePage from "@/components/Profile/ProfilePage";

export default async function Page({params}) {
  const { id } = await params;
  return <ProfilePage userId={id} />;
}
