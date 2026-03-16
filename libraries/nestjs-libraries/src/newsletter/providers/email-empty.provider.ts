import { NewsletterInterface } from '@turbotech/social-nestjs-libraries/newsletter/newsletter.interface';

export class EmailEmptyProvider implements NewsletterInterface {
  name = 'empty';
  async register(email: string) {
    console.log('Could have registered to newsletter:', email);
  }
}
