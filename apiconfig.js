const config = {
    backendUrl: process.env.NODE_ENV === 'production'
      ? 'https://notesbackend-thealkennist5301-rtts62wp.leapcell.dev'
      : 'http://localhost:3002',
  };
  
  export default config;
  