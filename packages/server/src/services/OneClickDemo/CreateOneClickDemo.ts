import { Inject, Service } from 'typedi';
import { faker } from '@faker-js/faker';
import uniqid from 'uniqid';
import AuthenticationApplication from '../Authentication/AuthApplication';
import OrganizationService from '../Organization/OrganizationService';
import { OneClickDemo } from '@/system/models/OneclickDemo';
import { SystemUser } from '@/system/models';
import { IAuthSignInPOJO } from '@/interfaces';
import { ICreateOneClickDemoPOJO } from './interfaces';
import { initalizeTenantServices } from '@/api/middleware/TenantDependencyInjection';

@Service()
export class CreateOneClickDemo {
  @Inject()
  private authApp: AuthenticationApplication;

  @Inject()
  private organizationService: OrganizationService;

  /**
   * Creates one-click demo account.
   * @returns {Promise<ICreateOneClickDemoPOJO>}
   */
  public async createOneClickDemo(): Promise<ICreateOneClickDemoPOJO> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const password = '123123123';
    const demoId = uniqid();

    await this.authApp.signUp({ firstName, lastName, email, password });

    const signedIn = await this.authApp.signIn(email, password);
    const tenantId = signedIn.tenant.id;
    const userId = signedIn.user.id;

    // Injects the given tenant IoC services.
    await initalizeTenantServices(tenantId);

    // Creates a new one-click demo.
    await OneClickDemo.query().insert({ key: demoId, tenantId, userId });

    const buildJob = await this.organizationService.buildRunJob(
      tenantId,
      {
        name: 'BIGCAPITAL, INC',
        base_currency: 'USD',
        location: 'US',
        language: 'en',
        fiscal_year: 'march',
        timezone: 'US/Central',
      },
      signedIn.user
    );
    return { email, demoId, signedIn, buildJob };
  }

  /**
   * Sign-in automicatlly using the demo id one creating an account finish.
   * @param {string} oneClickDemoId -
   * @returns {Promise<IAuthSignInPOJO>}
   */
  async autoSignIn(oneClickDemoId: string): Promise<IAuthSignInPOJO> {
    const foundOneclickDemo = await OneClickDemo.query()
      .findOne('key', oneClickDemoId)
      .throwIfNotFound();

    const userId = foundOneclickDemo.userId;
    const user = await SystemUser.query().findById(userId);

    const email = user.email;
    const password = '123123123';

    const signedIn = await this.authApp.signIn(email, password);

    return signedIn;
  }
}
