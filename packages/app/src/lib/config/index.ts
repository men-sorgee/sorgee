const config = {
  title: `Guys 'N Heat`,
  description: "Denver's social events for bi, married and discrete men.",
  baseUrl: process.env.BASE_URL || 'https://guysnheat.com',
  adminUrl: process.env.ADMIN_URL || 'https://admin.guysnheat.com',
  adminBaseUrl: process.env.ADMIN_URL || 'https://admin.guysnheat.com',
  memberCookie: 'gnh-id',
  pages: {
    homePage: 'ac330d1b-0340-4a61-9b42-996aa0936d2b',
    blogPage: 'e19c78ec-d804-4c77-af15-bb255f6aedac',
    rulesPage: '21adb349-b96c-4234-9044-a825736f22f5',
    registrationPage: 'c04e1b01-4487-46b5-a4c3-d8b1da49d53b',
    applyPage: '640f6685-f4a8-4e76-a13a-358ddfac30ea',
  },
  pledgeSurvey: '118dc4ac-356e-4349-a35c-3013679e655b',
  userImageId: 'b063b5ac-fcec-46ae-8225-bbfb4a0184b5',
  notifications: {
    congratsEmail: {
      big_brother: '3e1b9fff-42d0-41a5-ba1d-9450cc05b598',
      brother: 'c25e8f2e-669e-43f5-b126-d3a1527eb61f',
      inductee: '581ffb86-a3cc-4951-a31a-296988c12703',
      pledge: '52ff07f3-32d1-4d9e-ad39-e925a0a9e3cf'
    },
    pledgeSurvey: '118dc4ac-356e-4349-a35c-3013679e655b',
    eventSurvey: 'c3334a23-9e9c-418f-97ba-5b269991b822',
    eventNoShow: '81497c8d-ac48-402e-932b-9ded23e23c56'
  },
  surveys: {
    event: {
      name: '$EVENT$ Survey',
      title: 'Event Survey: $EVENT$',
      type: 'event',
      description: `## Thank you for attending this event.\n\nPlease answer the following questions to help us ensure a great experience for everyone.`,
      closing: 'It was great seeing you! Thanks for the feedback.',
      questions: [
        'cd7f08e3-75dd-4ba8-8b55-8c8e69d008a0',
        '3305ddcb-9113-4933-b219-a34d5c5da31b',
        '16492fec-7431-4059-9334-140f0fb022f6',
        '87b55475-95ce-42af-8245-5ba75b292832',
        '84c72750-eac8-4db7-a9cc-363dd27084dc',
        'cf2058a8-203d-4dce-96d6-c7bdafacd174',
        'ec5c61de-7c25-4dd2-9437-53a169cea118'
      ]
    }
  }
}
const {
  title,
  description,
  baseUrl,
  adminUrl,
  adminBaseUrl,
  memberCookie,
  pages,
  pledgeSurvey,
  userImageId,
  notifications,
  surveys
} = config
export {
  adminBaseUrl,
  adminUrl,
  baseUrl,
  description,
  memberCookie,
  notifications,
  pages,
  pledgeSurvey,
  title,
  userImageId,
  surveys
}
