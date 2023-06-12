import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Channel } from '../channels/entities/channel.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string, username: string) {
    console.log('[DEBUG] - BACK - create called in user.service.ts');
    const user = this.userRepository.create({ email, password, username });
    return this.userRepository.save(user);
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(user);
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async updateUserChannel(id: string, channel: Channel) {
    const user = await this.userRepository.preload({
      id,
      channel,
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    const isBanned = user.bannedChannels?.find(
      (bannedChannel) => bannedChannel.id === channel?.id,
    );

    if (isBanned) {
      throw new ForbiddenException(`You have been banned from this channel`);
    }

    return this.userRepository.save(user);
  }
}
