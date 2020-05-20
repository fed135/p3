export function schemaParser(socket) {
  const schemas = {};

  socket.subscribe('__updateSchema', () => {
    // Create or Update schema
  });

  function encode(schemaName, data) {

  }

  function decode(schemaName, buffer) {

  }

  return {
    encode,
    decode,
  };
}
