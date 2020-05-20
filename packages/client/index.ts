import { EventEmitter } from 'events';
import { connect, Routines } from 'kalm';

import { schemaParser } from './schemas';
import { frameStore } from './store';
import uuid from 'uuid/v4';

export function P3Client(options: P3ClientOptions): Promise<P3ClientNode> {
  const id = options.id || uuid();

  const socket = connect({
    label: id,
    host: options.host,
    port: Number(options.port),
    transport: options.transport,
    json: false,
    routine: Routines.tick({ hz: 60 }),
  });
  const parser = schemaParser(socket);
  const store = frameStore(socket, parser)

  function setInputState(entityId: string, inputs: P3InputList): string {
    return entityId;
  }

  function getFrame(frameIndex: number): P3Frame {

  }

  function getEntities(options?: P3FrameQueryOptions): P3Entity[] {
      
  }

  function createEntity(entityType: string, body?: P3EntityBody): string {
    return '';
  }

  function updateEntity(entityId: string, body: P3EntityBody): string {
    return entityId;
  }

  function killEntity(entityId: string): void {
    
  }

  return Object.assign({
    setInputState,
    getFrame,
    getEntities,
    createEntity,
    updateEntity,
    killEntity,
  }, EventEmitter.prototype);
}
