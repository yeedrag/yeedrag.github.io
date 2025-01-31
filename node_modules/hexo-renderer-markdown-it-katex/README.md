# hexo-renderer-markdown-it-katex

This plugin is forked from [hexo-renderer-markdown-it].
Adds support for [KaTeX] out of box,
which means you don't need to include the KaTeX stylesheet in your HTML manually.

This renderer plugin uses [Markdown-it] as a render engine on [Hexo]. Adds support for [Markdown] and [CommonMark].

## Main Features
- Support for [Markdown], [GFM] and [CommonMark]
- Extensive configuration
- Faster than the default renderer | `hexo-renderer-marked`
- Safe ID for headings
- Anchors for headings with ID
- Footnotes
- `<sub>` H<sub>2</sub>O
- `<sup>` x<sup>2</sup>
- `<ins>` <ins>Inserted</ins>
- [KaTeX] out of box

## Installation
```sh
yarn remove hexo-renderer-marked
yarn add hexo-renderer-markdown-it-katex
```

## Options

``` yml
markdown:
  render:
    html: true
    xhtmlOut: false
    breaks: true
    linkify: true
    typographer: true
    quotes: '“”‘’'
  plugins:
  anchors:
    level: 2
    collisionSuffix: ''
```

Refer to [the wiki](https://github.com/hexojs/hexo-renderer-markdown-it/wiki) for more details.

## KaTeX
We use `@abreto/markdown-it-katex` plugin
and automatically include the KaTeX stylesheet in every HTML document generated.
Current KaTeX version is `0.11.1`.

## Suggested plugins
- markdown-it-deflist
- markdown-it-abbr

## Requests and bug reports
If you have any feature requests or bugs to report, you're welcome to [file an issue](https://github.com/hexojs/hexo-renderer-markdown-it/issues).


[CommonMark]: http://commonmark.org/
[Markdown]: http://daringfireball.net/projects/markdown/
[GFM]: https://help.github.com/articles/github-flavored-markdown/
[Markdown-it]: https://github.com/markdown-it/markdown-it
[Hexo]: http://hexo.io/
[hexo-renderer-markdown-it]: https://github.com/hexojs/hexo-renderer-markdown-it
[KaTeX]: https://katex.org/
