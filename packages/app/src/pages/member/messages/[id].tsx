import { useRouter } from "next/router";

import ChatPage from "./index";

export default function ChatConversationPage() {
  const router = useRouter()
  const { id } = router.query
  return ChatPage({ id: String(id) })
}
