import { auth } from "@clerk/nextjs/server";

const { getToken, userId } = await auth();
const jwtToken = await getToken({ template: 'aflower' });
export default function Page() {
  return (
    <p>Token: {jwtToken}</p>
  )
}
