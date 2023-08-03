import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Logger
} from '@nestjs/common'

import { ChannelsService } from '@/modules/chat/channels/channels.service'

@Injectable()
export class OwnershipGuard implements CanActivate {
  private readonly logger = new Logger(OwnershipGuard.name)

  constructor(private readonly channelService: ChannelsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const userId = request.session.userId
    const channelId = request.params.channelId

    const channel = await this.channelService.findOneById(channelId)
    if (!channel) {
      this.logger.warn(`Channel with ID : ${channelId} not found`)
      return false
    }

    if (userId !== channel.owner.id) {
      this.logger.warn(
        `User with ID : ${userId} is not the owner of channel with ID : ${channelId}`
      )
      return false
    }

    return true
  }
}
