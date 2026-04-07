import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './entities/bot.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private botsRepository: Repository<Bot>,
    private readonly httpService: HttpService,
  ) {}

  findAll(type?: 'general' | 'cyber'): Promise<Bot[]> {
    if (type) {
      return this.botsRepository.find({ where: { type } });
    }
    return this.botsRepository.find();
  }

  async executeBot(id: string, prompt: string): Promise<any> {
    const bot = await this.botsRepository.findOneBy({ id });
    if (!bot) return { error: 'Bot not found' };

    bot.status = 'working';
    await this.botsRepository.save(bot);

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/execute', {
          prompt,
          user_id: 'mock-uuid',
          bot_type: bot.type,
        }),
      );

      bot.status = 'completed';
      await this.botsRepository.save(bot);

      return response.data;
    } catch (error) {
      bot.status = 'idle';
      await this.botsRepository.save(bot);
      return { error: 'AI Service communication failed' };
    }
  }

  async updateStatus(id: string, status: 'idle' | 'working' | 'completed'): Promise<Bot | null> {
    const bot = await this.botsRepository.findOneBy({ id });
    if (bot) {
      bot.status = status;
      return this.botsRepository.save(bot);
    }
    return null;
  }
  
  create(botData: Partial<Bot>): Promise<Bot> {
    const bot = this.botsRepository.create(botData);
    return this.botsRepository.save(bot);
  }
}
