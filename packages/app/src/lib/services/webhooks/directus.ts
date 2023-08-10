import { postJSON } from "lib/utils";

export async function sendAdminNotification(notificationId: string) {
  // disabled until I get this working
  //const { success, error } = await postJSON('https://admin.guysnheat.com/flows/trigger/13348cf5-0732-47c7-9e89-f9f59eac68a8', {
  //  key: notificationId,
  //})
  //if (!success) {
  //  throw new Error(error.message)
  //}
  return Promise.resolve()
}
