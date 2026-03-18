export const registerVueLanguage = (monaco: any) => {
  monaco.languages.register({ id: 'vue' });
  monaco.languages.setMonarchTokensProvider('vue', {
    tokenizer: {
      root: [
        [/<script>/, { token: 'tag', next: '@script', nextEmbedded: 'javascript' }],
        [/<style>/, { token: 'tag', next: '@style', nextEmbedded: 'css' }],
        [/<\/?\w+/, 'tag'],
        [/[^<]+/, ''],
      ],
      script: [
        [/<\/script>/, { token: 'tag', next: '@pop', nextEmbedded: '@pop' }],
        [/./, 'token.content']
      ],
      style: [
        [/<\/style>/, { token: 'tag', next: '@pop', nextEmbedded: '@pop' }],
        [/./, 'token.content']
      ],
    }
  });
};