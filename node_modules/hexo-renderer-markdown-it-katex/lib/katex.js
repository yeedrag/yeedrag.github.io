'use strict';

const plugin_name = '@abreto/markdown-it-katex';
const katex_version = '0.11.1';
const katex_css_url = `https://cdn.bootcss.com/KaTeX/${katex_version}/katex.min.css`;

function katex_filter(data) {
  const insertion_item = `<link href="${katex_css_url}" rel="stylesheet" />`;
  const head_close = '</head>';

  if (data.indexOf(insertion_item) != -1) {
    return data;
  }

  return data.replace(
    new RegExp(head_close, 'i'),
    insertion_item + head_close
  );
}

module.exports = {
  plugin: require(plugin_name),
  filter: katex_filter,
};
