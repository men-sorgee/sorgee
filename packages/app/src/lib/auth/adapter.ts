import {
  User,
  UserSession,
  UserVerificationToken
} from "lib/services/db/entities";
import {
  addVerificationToken,
  createAccount,
  createSession,
  createUser,
  deleteAccount,
  deleteSession,
  findSession,
  findUser,
  findUserByAccount,
  findVerificationToken,
  getUser,
  updateSession,
  updateUser
} from "lib/services/db/server/users";
import { importFile, UploadFolder } from "lib/services/directus/server/files";
import { getAssetUrl } from "lib/utils";
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken
} from "next-auth/adapters";

function mapUser(user: User): AdapterUser {
  return {
    id: user?.id,
    email: user.email,
    emailVerified: new Date(user.dateCreated),
    name: user.firstName,
    image: getAssetUrl(user.picture)
  }
}

function mapSession(session: UserSession): AdapterSession {
  const user = session.user
  return {
    userId: user.id,
    expires: new Date(session.expires),
    sessionToken: session.sessionToken,
  }
}

function mapToken(token: UserVerificationToken): VerificationToken {
  return {
    identifier: token.email,
    expires: new Date(token.expires),
    token: token.token,
  }
}

function log(...args) {
  console.debug(...args)
}

const authAdapter: Adapter = {
  async createUser(user: AdapterUser & { picture: string }) {
    try {
      log('createUser', user)
      let image
      if (user.image || user.picture) {
        const imageUrl = (user.image || user.picture) as string
        image = await importFile(imageUrl, UploadFolder.members, `avatar-${user.email}`)
      }
      const newUser = await createUser({
        email: user.email?.toLowerCase(),
        emailVerified: user.emailVerified != null,
        nickname: user.name,
        firstName: user.name,
        picture: image as any,
      })
      return mapUser(newUser)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUser(id: string) {
    try {
      log('getUser', id)
      const user = await getUser(id)
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUserByEmail(email: string) {
    try {
      log('getUserByEmail', email)
      if (!email) return null
      const user = await findUser(email.toLowerCase())
      if (!user) return null
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUserByAccount({ providerAccountId, provider }: AdapterAccount) {
    try {
      log('getUserByAccount', providerAccountId, provider)
      const user = await findUserByAccount(provider, providerAccountId)
      if (!user) return null
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async updateUser(user: AdapterUser) {
    try {
      log('updateUser', user)
      const updatedUser = await updateUser(user.id, {
        emailVerified: user.emailVerified != null,
        status: 'active',
      })
      return mapUser(updatedUser)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async linkAccount(account: AdapterAccount) {
    try {
      log('linkAccount', account)

      const {
        provider,
        providerAccountId: providerId,
        type,
        userId,
        access_token: accessToken,
        expires_at: expiresAt,
        id_token: idToken,
        refresh_token: refreshToken,
        scope,
      } = account
      await createAccount({
        provider,
        providerId,
        user: { id: userId },
        type,
        scope,
        accessToken,
        expiresAt,
        idToken,
        refreshToken,
      })
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async unlinkAccount({ providerAccountId, provider }: AdapterAccount) {
    try {
      log('unlinkAccount', providerAccountId, provider)
      await deleteAccount(provider, providerAccountId)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async createSession(sessionData: Partial<AdapterSession>) {
    try {
      log('createSession', sessionData)
      const session = await createSession({
        sessionToken: sessionData.sessionToken,
        user: { id: sessionData.userId },
        expires: sessionData.expires,
      } as any)
      return mapSession(session as UserSession)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getSessionAndUser(sessionToken: string) {
    try {
      log('getSessionAndUser', sessionToken)
      const session = await findSession(sessionToken)
      if (!session) return null
      const user = await getUser(session.user.id)
      if (!user) return null
      return {
        user: mapUser(user),
        session: mapSession(session),
      }
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async updateSession(session: AdapterSession) {
    try {
      log('updateSession', session)
      const updatedSession = await updateSession(session.sessionToken, session.expires)
      return mapSession(updatedSession as UserSession)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async deleteSession(sessionToken: string) {
    try {
      log('delete-session', sessionToken)
      await deleteSession(sessionToken)
    } catch (e) {
      console.error(e?.config?.res?.body?.errors[0].message || e)
    }
  },
  async createVerificationToken(token: VerificationToken) {
    try {
      const verificationToken = await addVerificationToken(
        token.identifier,
        token.token,
        token.expires.toISOString()
      )
      return mapToken(verificationToken)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message)
    }
  },
  async useVerificationToken({ identifier, token }: VerificationToken) {
    try {
      log('useVerificationToken', identifier, token)
      const verificationToken = await findVerificationToken(identifier, token)
      if (!verificationToken) return null

      return mapToken(verificationToken)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
}

export { authAdapter }
