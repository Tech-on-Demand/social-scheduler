import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '@turbotech/social-nestjs-libraries/database/prisma/prisma.service';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedOrgAndUser();
  }

  private async seedOrgAndUser() {
    const orgId = 'techondemand-org-001';
    const userEmail = 'brayden@techondemand.com.au';

    const org = await this.prisma.organization.upsert({
      where: { id: orgId },
      update: {},
      create: {
        id: orgId,
        name: 'TechOnDemand',
      },
    });

    this.logger.log(`Organization seeded: ${org.name} (${org.id})`);

    const user = await this.prisma.user.upsert({
      where: {
        email_providerName: {
          email: userEmail,
          providerName: 'LOCAL',
        },
      },
      update: {},
      create: {
        email: userEmail,
        providerName: 'LOCAL',
        timezone: 0,
      },
    });

    this.logger.log(`User seeded: ${user.email} (${user.id})`);

    await this.prisma.userOrganization.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: org.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        organizationId: org.id,
        role: 'ADMIN',
      },
    });

    this.logger.log(`User ${user.email} linked to org ${org.name} as ADMIN`);
  }
}
