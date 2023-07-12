import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '@/modules/users/users.service';

import { Channel } from '@/modules/channels/entities/channel.entity';
import { Message } from '@/modules/channels/entities/message.entity';
import { User } from '@/modules/users/user.entity';

import { AddMessageDto } from '@/modules/chat/dtos/add-message.dto';
import { BanUserDto } from '@/modules/chat/dtos/ban-user.dto';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly userService: UsersService,
  ) {}

  // ****** //
  // LOGGER //
  // ****** //

  private logger = new Logger(ChannelsService.name);

  // ******************** //
  // FUNCTION DEFINITIONS //
  // ******************** //

  // ******* //
  // findOne //
  // ******* //

  async findOne(id: string) {
    const channel = await this.channelsRepository.findOneBy({ id });

    if (!channel) {
      throw new NotFoundException(`There is no channel under id ${id}`);
    }

    return channel;
  }

  // ********* //
  // getDmList //
  // ********* //

  async getDmList(userId: string): Promise<Channel[]> {
    if (!userId) {
      this.logger.warn(`ID of the user is required.`);
      throw new BadRequestException('ID of the user is required.');
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      this.logger.warn(`User with ID : ${userId} not found in database.`);
      throw new NotFoundException(
        `User with ID : ${userId} not found in database.`,
      );
    }

    const dm = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoinAndSelect('channel.members', 'user', 'user.id = :userId', {
        userId,
      })
      .where('channel.isDm = :isDm', { isDm: true })
      .getMany();
    if (!dm.length) {
      this.logger.verbose(`No DMs found in database for ${userId}.`);
      return [];
    }

    this.logger.verbose(`DMs list of : ${userId} successfully retrieved.`);

    return dm;
  }

  // async findAll() {
  //   const channels = await this.channelRepository.find({
  //     relations: ['messages'],
  //   });

  //   if (!channels) {
  //     throw new NotFoundException(`No channels found`);
  //   }

  //   return channels;
  // }

  // async findOneWithRelations(id: string) {
  //   const channel = await this.channelRepository.findOneBy({ id });

  //   if (!channel) {
  //     throw new NotFoundException(`There is no channel under id ${id}`);
  //   }

  //   return channel;
  // }

  // async create(createChannelDto: CreateChannelDto) {
  //   const newChannel = this.channelRepository.create({
  //     ...createChannelDto,
  //   });

  //   const channel = await this.channelRepository.save(newChannel);

  //   return channel;
  // }

  // async update(id: string, updateChannelDto: UpdateChannelDto) {
  //   const channel = await this.channelRepository.preload({
  //     id,
  //     ...updateChannelDto,
  //   });

  //   if (!channel) {
  //     throw new NotFoundException(`There is no channel under id ${id}`);
  //   }

  //   return this.channelRepository.save(channel);
  // }

  // async remove(id: string) {
  //   const channel = await this.findOne(id);

  //   return this.channelRepository.remove(channel);
  // }

  // async addMessage(addMessageDto: AddMessageDto) {
  //   const { messageBody, channelId, userId } = addMessageDto;

  //   const channel = await this.findOne(channelId);

  //   const user = await this.userService.findOneById(userId);

  //   const newMessage = this.messageRepository.create({
  //     messageBody,
  //     channel,
  //     user,
  //   });

  //   const message = await this.messageRepository.save(newMessage);

  //   return message;
  // }

  // async banUserFromChannel(banUserDto: BanUserDto) {
  //   const user = await this.userService.findOneById(banUserDto.userId);

  //   const channel = await this.findOne(banUserDto.channelId);

  //   await this.userService.updateUserChannel(banUserDto.userId, null);

  //   const bannedMembers = { ...channel.bannedMembers, ...user };
  //   const updatedChannel = await this.channelRepository.preload({
  //     id: banUserDto.channelId,
  //     bannedMembers,
  //   });

  //   return this.channelRepository.save(updatedChannel);
  // }
}
