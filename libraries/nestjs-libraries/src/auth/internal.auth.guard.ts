import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@turbotech/social-nestjs-libraries/database/prisma/prisma.service';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orgId = request.headers['x-org-id'];
    const userEmail = request.headers['x-user-email'];

    if (!orgId || !userEmail) {
      throw new UnauthorizedException(
        'Missing X-Org-Id or X-User-Email headers'
      );
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      throw new UnauthorizedException(`Organization ${orgId} not found`);
    }

    const allowedEmails = (process.env.ALLOWED_EMAILS || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    const defaultEmail = 'brayden@techondemand.com.au';

    if (
      userEmail !== defaultEmail &&
      !allowedEmails.includes(userEmail)
    ) {
      throw new UnauthorizedException(
        `Email ${userEmail} is not authorized`
      );
    }

    return true;
  }
}
