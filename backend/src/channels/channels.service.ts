import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as bcrypt from 'bcrypt';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CheckPasswordDto } from './dto/check-password.dto';
import { EditRoleDto } from './dto/edit-role.dto';
import { CreateChannelMessageDto } from './dto/create-channel-message.dto';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class ChannelsService extends PrismaClient {
  constructor(private webSocketGateway: ChatGateway) {
    super();
  }

  async createChannel(channelDto: CreateChannelDto, creatorId: number) {
    await this.checkIfChannelExists(channelDto.name);

    channelDto.ownerId = creatorId;
    if (channelDto.privacy === 'protected')
      channelDto.password = await bcrypt.hash(channelDto.password, 10);

    const newChannel = await this.channel.create({
      data: channelDto,
    });

    await this.joinChannel(newChannel.id, creatorId, null, false, [], 'owner', false);
  }

  async updateChannel(
    channelDto: UpdateChannelDto,
    userId: number,
    channelId: number,
  ) {
    const oldChannel = await this.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (Object.keys(channelDto).length === 0 || userId != oldChannel.ownerId)
      throw new BadRequestException(userId == oldChannel.ownerId ? 'No data found in body.' : 'Only the owner can update the channel\'s general infos.');
    if (!oldChannel)
      throw new NotFoundException('Channel to update not found.');
    if (channelDto.name)
		await this.checkIfChannelExists(channelDto.name);
    await this.checkNewPassword(channelDto);

    const updatedChannel = await this.channel.update({
      where: { id: channelId },
      data: channelDto,
      select : this.channelSelectOptions
    });
    await this.formatChannelMembers(updatedChannel);
    this.webSocketGateway.sendChannelData(updatedChannel);
    if (!updatedChannel) throw new InternalServerErrorException();
  }

  async findUniqueChannel(data: any, selectOptions: any) {
    const channel = selectOptions
      ? await this.channel.findUnique({
          where: data,
          select: selectOptions,
        })
      : await this.channel.findUnique({
          where: data,
        });

    if (!channel) throw new NotFoundException('Channel not found.');
    return channel;
  }

  async getAllChannelMembers(channelId: number) {
    const allMembersIds = await this.channelMember.findMany({
      where: {
        channelId: channelId,
      },
      select: {
        role: true,
        isMuted: true,
        userId: true,
      },
    });

    if (allMembersIds.length == 0)
      throw new NotFoundException('Channel not found.');
    const membersAsUsers = await this.user.findMany({
      where: {
        id: {
          in: allMembersIds.map((member) => member.userId),
        },
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        createdAt: true,
        email: true,
        username: true,
      },
    });

    return membersAsUsers.map((member) => {
      const user = allMembersIds.find((memberId) => memberId.userId == member.id);
      const role = user.role;
      const isMuted = user.isMuted;

      // const { role, isMuted } = {
      //   ...allMembersIds.find((memberId) => memberId.userId == member.id),
      // };

      return { ...member, role, isMuted };
    });
  }

  async getChannelWithMembers(
    channelName: string,
    channelId: number,
  ) {
    let channel: any = channelName
      ? await this.findUniqueChannel({ name: channelName }, this.channelSelectOptions)
      : await this.findUniqueChannel({ id: channelId }, this.channelSelectOptions);

    await this.formatChannelMembers(channel);
    return [channel];
  }

  async getAvailableChannels() {
    const allChannels = await this.channel.findMany({
      where: {
        privacy: {
          in: ['public', 'protected'],
        },
      },
      select: this.channelSelectOptions,
    });

    const formattedChannels = await Promise.all(
      allChannels.map(async (channel: any) => {
        const usersAsMembers = await this.user.findMany({
          where: {
            id: {
              in: channel.members.map((member) => member.userId),
            },
          },
          select: {
            id: true,
            avatar: true,
            name: true,
            createdAt: true,
            email: true,
            username: true,
          },
        });

        const formattedUsers = usersAsMembers.map((user) => {
          const member = channel.members.find(
            (member) => member.userId == user.id,
          );
          const { isMuted, role } = member;

          return { ...user, isMuted, role };
        });

        channel.members = formattedUsers;
        return channel;
      }),
    );

    return formattedChannels;
  }

  async joinChannel(
    channelId: number,
    userId: number,
    members: any,
    shouldCheck: boolean,
    banned: number[],
    role: string,
	shouldEmit: boolean
  ) {
    if (banned.find((bannedUserId) => bannedUserId == userId))
      throw new BadRequestException('Banned from this channel.');
    if (
      shouldCheck &&
      members?.find(
        (member) => member.userId == userId && channelId == channelId,
      )
    )
      throw new BadRequestException('Already a member of this channel.');

    const newMember = await this.channelMember.create({
      data: {
        userId: userId,
        role: role,
      },
    });

    if (!newMember) throw new InternalServerErrorException();
	let updatedChannel = await this.channel.update({
      where: {
        id: channelId,
      },
      data: {
        members: {
          connect: {
            id: newMember.id,
          },
        },
      },
	  select : this.channelSelectOptions
    });

	if (!shouldEmit)
		return ;
   let membersAsUser = await this.user.findMany({
      where: {
        id: {
          in: updatedChannel.members.map(
            (member: { userId: number }) => member.userId,
          ),
        },
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        createdAt: true,
        email: true,
        username: true,
      },
    });

    let formattedMembers = membersAsUser.map((user) => {
      const member = updatedChannel.members.find(
        (member: { userId: number }) => member.userId == user.id,
      );
      const { isMuted, role } = member;

      return { ...user, isMuted, role };
    });
	delete updatedChannel.members;
	const toEmit = {
		id : updatedChannel.id,
		name : updatedChannel.name,
		ownerId : updatedChannel.ownerId,
		privacy : updatedChannel.privacy,
		description : updatedChannel.description,
		banned : updatedChannel.banned,
		members : [...formattedMembers]
	};

	this.webSocketGateway.sendChannelData(toEmit);
  }

  async deleteChannel(channelId: number, userId: number) {
    const channelToDelete = await this.findUniqueChannel({id : channelId}, null);
  	const members = await this.channelMember.deleteMany({
		  where : {
			  channelId : channelId,
		  }
	  })

    if (members.count >= 0)
    {
      const deletedChannel = await this.channel.delete({ where: { id: channelId } });
      if (!deletedChannel)
        throw new InternalServerErrorException();
    }
    if (userId != channelToDelete.ownerId)
      throw new BadRequestException('Only the owner can delete his channel.');
    await this.channelMessage.deleteMany({
      where: {
        channelId: channelId,
      },
    });
  }

  async ban(channelId: number, memberToBanId: number, editorId: number) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true, banned: true },
    );
    const toBan = channel.members.find(
      (member) => member.userId === memberToBanId,
    );
    const editor = channel.members.find((member) => member.userId === editorId);

    if (channel.banned.find((banned) => banned == memberToBanId))
      throw new ConflictException('This user is already banned.');
    if (!toBan || !editor)
      throw new NotFoundException(
        !toBan
          ? 'Member to ban not found.'
          : 'Member that wants to ban not found.',
      );
    if (toBan.userId === editor.userId)
      throw new ForbiddenException(
        "Member that wants to ban can't ban himself.",
      );
    if (!this.canControl(editor.role, toBan.role))
      throw new ForbiddenException('No privileges to ban this member.');
    const banned = [...channel.banned, memberToBanId];

    await this.channelMember.deleteMany({
      where: {
        channelId: channelId,
        userId: memberToBanId,
      },
    });
    await this.channel.update({
      where: {
        id: channelId,
      },
      data: {
        banned: banned,
      },
    });
  }

  async muteOrUnmute(
    isMuted: boolean,
    channelId: number,
    memberToMuteId: number,
    muterId: number,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true },
    );
    const toMute = channel?.members?.find(
      (member) => member.userId == memberToMuteId,
    );
    const muter = channel?.members?.find((member) => member.userId == muterId);

    if (!toMute || !muter)
      throw new NotFoundException(
        !toMute ? 'Member to mute not found.' : 'Muter not found.',
      );
    if (toMute.id == muter.id)
      throw new ConflictException("Muter can't mute/unmute himself.");
    if (!this.canControl(muter.role, toMute.role))
      throw new ForbiddenException('No privileges to mute this member.');
    await this.channelMember.updateMany({
      where: {
        channelId: channelId,
        userId: memberToMuteId,
      },
      data: {
        isMuted: isMuted,
      },
    });
  }

  async getAllJoinedChannels(memberId: number) {
    const member = await this.channelMember.findMany({
      where: {
        userId: memberId,
      },
    });

    let allChannels = await this.channel.findMany({
      where: {
        id: {
          in: member.map((member) => member.channelId),
        },
      },
      select: this.channelSelectOptions,
    });

    const allUsers = await this.user.findMany({
      where: {
        id: {
          in: Array.from(
            new Set(
              [].concat(
                ...allChannels.map((channel) => {
                  return channel.members.map((member) => member.userId);
                }),
              ),
            ),
          ),
        },
      },
    });

    allChannels = allChannels.map((channel) => {
      const members = channel.members.map((member) => {
        const newMember = member;
        const userAsMember = allUsers.find((user) => user.id == member.userId);

        newMember.id = member.userId;
        delete newMember.userId;
        return {
          ...newMember,
          avatar: userAsMember.avatar,
          name: userAsMember.name,
        };
      });
      channel.members = members;
      return channel;
    });
    return allChannels;
  }

  async editMemberRole(
    channelId: number,
    editorId: number,
    editDto: EditRoleDto,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true, banned: true },
    );
    const editor = channel?.members?.find(
      (member) => member.userId == editorId,
    );
    const userToEdit = await this.user.findUnique({
      where: { username: editDto.username },
    });

    if (!userToEdit || !editor)
      throw new NotFoundException(
        !userToEdit ? 'User not found.' : 'Editor not found.',
      );
    const memberToEdit = channel?.members?.find(
      (member) => member.userId == userToEdit.id,
    );

    if (memberToEdit && memberToEdit.id == editor.id)
      throw new ConflictException("Editor can't edit himself.");
    if (memberToEdit && !this.canControl(editor.role, memberToEdit.role))
      throw new ForbiddenException('No privileges to edit/add this member.');
    if (memberToEdit && this.canControl(editor.role, memberToEdit.role)) {
      await this.channelMember.updateMany({
        where: {
          channelId: channelId,
          userId: memberToEdit.userId,
        },
        data: {
          role: editDto.role,
        },
      });
      return 'Role of member has been edited.';
    }

	await this.joinChannel(
      channelId,
      userToEdit.id,
      [],
      false,
      channel.banned,
      editDto.role,
	  true
    );
	return 'New member with role \'' + editDto.role + '\' has been created.'
  }

  async removeMember(
    channelId: number,
    userToLeaveId: number,
    action: string,
    kickerId: number,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: channelId },
      { members: true },
    );
    const memberToLeave = channel?.members?.find(
      (member) => member.userId == userToLeaveId,
    );
    const kicker =
      action == 'kick'
        ? channel?.members?.find((member) => member.userId == kickerId)
        : null;

    if (!memberToLeave)
      throw new NotFoundException(
        action == 'kick'
          ? 'Member to kick not found.'
          : 'Member to leave not found.',
      );
    if (memberToLeave.role == 'owner')
      throw new ForbiddenException(
        "The owner can't leave or be kicked from this channel.",
      );
    if (action == 'kick') {
      if (!kicker) throw new NotFoundException('Kicker not found.');
      else if (!this.canControl(kicker.role, memberToLeave.role))
        throw new ForbiddenException('No provileges to kick this member.');
      else if (kicker.userId == memberToLeave.userId)
        throw new ConflictException('The kicker can\'t kick himself.');
    }
    await this.channelMember.deleteMany({
      where: {
        channelId: channelId,
        userId: userToLeaveId,
      },
    });
  }

  async validateAndJoinChannel(channelId: number, checkPasswordDto: CheckPasswordDto) {
    const channel : any = await this.findUniqueChannel({id : channelId}, {members : true, banned : true, privacy : true, password : true});
    const user = await this.user.findUnique({
      where: {
        id: checkPasswordDto.userId,
      },
    });

    if (channel.privacy == 'protected' && !checkPasswordDto.password)
      throw new BadRequestException('Password must not be empty.');
    if (!user)
      throw new NotFoundException('User to join not found.');
    if (channel.privacy == 'protected' && !(await bcrypt.compare(checkPasswordDto.password, channel.password)))
      throw new BadRequestException('Invalid password.');
    await this.joinChannel(
      channelId,
      user.id,
      channel.members,
      true,
      channel.banned,
      'member',
	  false
    );
  }

  async createChannelMessage(
    createMessageDto: CreateChannelMessageDto,
    senderIdFromJwt: number,
  ) {
    const channel: any = await this.findUniqueChannel(
      { id: createMessageDto.channelId },
      { members: true, banned: true, name: true },
    );
    const sender = channel.members.find(
      (member) => member.userId == createMessageDto.senderId,
    );
    const isBanned = channel.banned.find(
      (banned) => banned == createMessageDto.senderId,
    );

    if (senderIdFromJwt != createMessageDto.senderId)
      throw new ForbiddenException(
        'Sender id is different from the id provided.',
      );
    if (!sender) throw new NotFoundException('Member not found in channel.');
    if (isBanned) throw new ConflictException('Banned from this channel.');
    const member = await this.channelMember.findMany({
      where: {
        userId: senderIdFromJwt,
        channelId: channel.id,
      },
    });

    const user = member?.find(member => member.userId == senderIdFromJwt && member.channelId == createMessageDto.channelId);
    if (user?.isMuted)
      throw new ForbiddenException('Muted from this channel.');
	  this.formatMessageAndEmit(createMessageDto, channel, sender);
    return 'Message created successfully.';
  }

  private async formatMessageAndEmit(createMessageDto : CreateChannelMessageDto, channel : any, sender : any) {
    createMessageDto.receivers = channel.members
      .filter((member) => member.userId != sender.userId)
      .map((member) => member.userId);
    const createdMessage = await this.channelMessage.create({
      data: createMessageDto,
    });
    const { id, name, username, email, avatar, campus, status } =
      await this.user.findUnique({
        where: {
          id: sender.userId,
        },
      });
    const lastMessageCreatedAt = createdMessage.createdAt;

    createdMessage['lastMessageCreatedAt'] = lastMessageCreatedAt;
    createdMessage['channelName'] = channel.name;
    delete createdMessage.createdAt;
    const messageToEmit = {
      sender: { id, name, username, avatar, campus, status, email },
      ...createdMessage,
    };

    this.webSocketGateway.sendChannelMessage(messageToEmit);
    if (!createdMessage)
      throw new InternalServerErrorException('Could not create message.');
	}

  async getAllChannelMessages(channelName: string) {
    const channel: any = await this.findUniqueChannel(
      { name: channelName },
      null,
    );

    if (!channel) throw new NotFoundException('Channel not found.');

    const allChannelMessages = await this.channelMessage.findMany({
      where: {
        channelId: channel.id,
      },
    });

    const allUsers = await this.user.findMany({
      where: {
        id: {
          in: Array.from(
            new Set(
              allChannelMessages.map(
                (channelMessage) => channelMessage.senderId,
              ),
            ),
          ),
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        campus: true,
        status: true,
      },
    });

    const formattedMessages = allChannelMessages.map((message) => {
      const user = allUsers.find((user) => user.id == message.senderId);
      const createdAt = message.createdAt;

      delete message.createdAt;
      return {
        sender: user,
        ...message,
        lastMessageCreatedAt: createdAt,
        channelName: channel.name,
      };
    });

    return formattedMessages;
  }

  private async checkNewPassword(channelDto: UpdateChannelDto) {
    let privacy = channelDto.privacy;

    if (!privacy) return;
    if (privacy != 'protected') channelDto.password = null;
    else if (
      privacy == 'protected' &&
      (!channelDto.hasOwnProperty('password') || channelDto.password.length < 4)
    )
      throw new BadRequestException(
        !channelDto.hasOwnProperty('password')
          ? 'Protected channels must have a password.'
          : 'Channel password must have at least 4 characters.',
      );
    else if (privacy == 'protected')
      channelDto.password = await bcrypt.hash(channelDto.password, 10);
  }

  private async checkIfChannelExists(name: string) {
    const channel = await this.channel.findUnique({
      where: {
        name: name,
      },
    });

    if (channel)
      throw new ConflictException(
        "Channel name '" + name + "' is already taken",
      );
  }

  private canControl(roleOfEditor: string, roleOfUserToEdit: string) {
    return (
      roleOfEditor == 'owner' ||
      (roleOfEditor == 'admin' && roleOfUserToEdit == 'member')
    );
  }

  private async formatChannelMembers(channel : any) {
    const members = await this.user.findMany({
          where: {
            id: {
              in: channel.members.map(
                (member: { userId: number }) => member.userId,
              ),
            },
          },
          select: {
            id: true,
            avatar: true,
            name: true,
            createdAt: true,
            email: true,
            username: true,
          },
        });

        channel.members = members.map((user) => {
          const member = channel.members.find(
            (member: { userId: number }) => member.userId == user.id,
          );
          const { isMuted, role } = member;

          return { ...user, isMuted, role };
        });
      }

    private channelSelectOptions = {
	  	members : true,
      id : true, 
      banned : true, 
      description : true, 
      privacy : true,
      name : true,
      ownerId : true
    }
}