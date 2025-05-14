import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

const logger = new Logger('EnvWatcher');

export class EnvWatcher {
  private envPath: string;
  private watcher: fs.FSWatcher | null = null;

  constructor(envFilePath?: string) {
    this.envPath = envFilePath || path.resolve(process.cwd(), '.env');
  }

  /**
   * Start watching the .env file for changes
   */
  watch(): void {
    // Load the environment variables initially
    this.loadEnvVariables();
    
    logger.log(`Watching for changes in: ${this.envPath}`);
    
    // Set up file watcher
    this.watcher = fs.watch(this.envPath, (eventType) => {
      if (eventType === 'change') {
        logger.log('Environment file changed, reloading variables...');
        this.loadEnvVariables();
      }
    });
  }

  /**
   * Stop watching the .env file
   */
  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      logger.log('Stopped watching environment file');
    }
  }

  /**
   * Reload environment variables from the .env file
   */
  private loadEnvVariables(): void {
    try {
      const result = dotenv.config({ path: this.envPath, override: true });
      
      if (result.error) {
        throw result.error;
      }
      
      logger.log('Environment variables reloaded successfully');
    } catch (error) {
      logger.error(`Failed to reload environment variables: ${error.message}`);
    }
  }
}
