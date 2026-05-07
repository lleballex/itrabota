import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { AppConfig } from "@/config/config.interface"

interface CreateZoomMeetingData {
  topic: string
  startsAt: Date
  durationMinutes: number
  timezone: string
}

interface ZoomTokenResponse {
  access_token?: string
}

interface ZoomMeetingResponse {
  join_url?: string
}

@Injectable()
export class ZoomMeetingsService {
  private readonly logger = new Logger(ZoomMeetingsService.name)

  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  async createMeeting(data: CreateZoomMeetingData) {
    try {
      const token = await this.getAccessToken()

      if (!token) {
        return null
      }

      const hostUserId =
        this.configService.get("ZOOM_HOST_USER_ID", { infer: true }) ?? "me"
      const res = await fetch(
        `https://api.zoom.us/v2/users/${encodeURIComponent(hostUserId)}/meetings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: data.topic,
            type: 2,
            start_time: data.startsAt.toISOString(),
            duration: data.durationMinutes,
            timezone: data.timezone,
          }),
        },
      )

      const body = (await res
        .json()
        .catch(() => null)) as ZoomMeetingResponse | null

      if (!res.ok) {
        this.logger.warn(
          `Zoom meeting creation failed: ${res.status} ${JSON.stringify(body)}`,
        )
        return null
      }

      return body?.join_url ?? null
    } catch (e) {
      this.logger.warn(
        `Zoom meeting creation failed: ${
          e instanceof Error ? e.message : String(e)
        }`,
      )
      return null
    }
  }

  private async getAccessToken() {
    const accountId = this.configService.get("ZOOM_ACCOUNT_ID", {
      infer: true,
    })
    const clientId = this.configService.get("ZOOM_CLIENT_ID", { infer: true })
    const clientSecret = this.configService.get("ZOOM_CLIENT_SECRET", {
      infer: true,
    })

    if (!accountId || !clientId || !clientSecret) {
      this.logger.warn("Zoom credentials are not configured")
      return null
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    )
    const params = new URLSearchParams({
      grant_type: "account_credentials",
      account_id: accountId,
    })

    const res = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
    const body = (await res
      .json()
      .catch(() => null)) as ZoomTokenResponse | null

    if (!res.ok) {
      this.logger.warn(
        `Zoom token request failed: ${res.status} ${JSON.stringify(body)}`,
      )
      return null
    }

    return body?.access_token ?? null
  }
}
