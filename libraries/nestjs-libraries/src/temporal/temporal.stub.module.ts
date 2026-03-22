/**
 * Temporal Stub Module — replaces Temporal with no-op stubs.
 * Temporal is being replaced by pg-boss. Until migration is complete,
 * this stub allows the NestJS backend to boot without a Temporal server.
 *
 * Created: 2026-03-17
 */
import { Global, Module } from '@nestjs/common';
import { TemporalService } from 'nestjs-temporal-core';
import { SchedulerModule } from '@turbotech/social-nestjs-libraries/scheduler/scheduler.module';

const noopClient = {
  getRawClient: () => ({
    workflow: {
      signalWithStart: async () => ({}),
      getHandle: async () => ({
        terminate: async () => {},
        cancel: async () => {},
        query: async () => null,
        signal: async () => {},
      }),
    },
  }),
  getWorkflowHandle: async () => ({
    terminate: async () => {},
    cancel: async () => {},
    query: async () => null,
    signal: async () => {},
    describe: async () => ({}),
  }),
};

const stubTemporalService = {
  client: noopClient,
  worker: null,
  schedule: null,
  activity: null,
  discovery: null,
  metadata: null,
  startWorkflow: async () => ({}),
  signalWorkflow: async () => ({}),
  queryWorkflow: async () => ({}),
  getWorkflowHandle: async () => ({}),
  terminateWorkflow: async () => ({}),
  cancelWorkflow: async () => ({}),
  startWorker: async () => {},
  stopWorker: async () => {},
  isWorkerRunning: () => false,
  hasWorker: () => false,
  getWorkerStatus: () => null,
  executeActivity: async () => ({}),
  getHealth: () => ({ status: 'healthy', services: {}, isInitialized: true, namespace: 'default', summary: {} }),
  getOverallHealth: async () => ({ status: 'healthy' }),
  getStats: () => ({}),
};

@Global()
@Module({
  imports: [SchedulerModule],
  providers: [
    {
      provide: TemporalService,
      useValue: stubTemporalService,
    },
  ],
  exports: [TemporalService, SchedulerModule],
})
export class TemporalStubModule {}
