# frozen_string_literal: true

module ApplicationHelper
  def default_meta_tags
    {
      site: 'Humans Like Ants',
      title: t('meta_tags.default_title'),
      reverse: true, # タイトルタグ内の表記順をページタイトル|サイトタイトルの順にする
      charset: 'utf-8',
      description: t('meta_tags.description'),
      keywords: 'metaverse, 3D, ants',
      canonical: request.original_url,
      separator: '|',
      og: {
        site_name: :site,
        title: :title,
        description: :description,
        type: 'website',
        url: request.original_url,
        image: image_url('ogp.png'),
        local: 'ja-JP'
      },
      twitter: {
        card: 'summary_large_image',
        site: '@issei423',
        image: image_url('ogp.png')
      }
    }
  end

  def share_button(name, url=request.url)
    content_tag(:a, href: "https://twitter.com/share?url=#{ url }&text=#{ t('defaults.share_text', name: name ) }", target: '_blank', rel: 'noopener noreferrer', class: 'twitter-share-button') do
      concat content_tag(:i, '', class: 'fa-brands fa-twitter me-1')
      concat content_tag(:span, t('defaults.share'))
    end
  end
end
