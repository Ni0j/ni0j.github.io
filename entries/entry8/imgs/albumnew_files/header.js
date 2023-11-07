// header module
var header =
      '<header class="m-header-site jsc-header-page is-active">' +
//        '<div class="m-banner-header is-active jsc-banner-header">' +
//          '<div class="mbh-content">' +
//            '<span>テキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが６３文字</span>' +
//            '<span><a href="/dummylink" target="_blank">詳しくみる</a></span>' +
//            '<span class="mbh-btn-close jsc-btn-close"></span>' +
//          '</div>' +
//        '</div>' +
        '<div class="mhs-sub-area m-dn-sp">' +
          '<div class="mhs-content">' +
            '<div class="mhs-share-sns">' +
              '<!--<p class="mhs-label">公式SNS</p>-->' +
              '<ul>' +
                '<li><a href="https://www.instagram.com/victor_entertainment/" target=_blank" class="cs-headfoot-instagram m-link-img"></a></li>' +
                '<li><a href="https://twitter.com/VictorMusic" target=_blank" class="cs-headfoot-twitter m-link-img"></a></li>' +
                '<li><a href="https://vt.tiktok.com/ZSJhFCtW1/" target=_blank" class="cs-headfoot-tiktok m-link-img"></a></li>' +
                '<li><a href="https://www.facebook.com/jvcmusic" target=_blank" class="cs-headfoot-facebook m-link-img"></a></li>' +
                '<li><a href="https://timeline.line.me/user/_dRF0sgStjE09Gs_r9X5Wj4yOB-QT0ZwN5n0837M" target=_blank" class="cs-headfoot-line m-link-img"></a></li>' +
                '<li><a href="https://www.youtube.com/user/VictorMusicChannel" target=_blank" class="cs-headfoot-youtube m-link-img"></a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="mhs-top-menu">' +
              '<ul>' +
                '<li><a href="/-/Media/"><span>メディア</span></a></li>' +
                '<li><a href="/-/Tieup/"><span>タイアップ</span></a></li>' +
                '<li><a href="http://www.jvcmusic.co.jp/audition/vma/"><span>オーディション</span></a></li>' +
                '<li><a href="https://victor-store.jp" target=_blank" class="mhs-btn-shop"><span class="cs-icon-cart"></span><span>ビクターオンラインストア</span></a></li>' +
                '<li>' +
                  '<form class="mhs-search" method="get" action="/-/Search/">' +
                     '<select name="mode">' +
                     '<option value="1">アーティスト</option>' +
                    '<option value="2">商品名</option>' +
                    '<option value="3">楽曲名</option>' +
                    '</select>' +
                    '<input type="search" name="keyword" placeholder="">' +
                    '<button type="submit" class="cs-header-search"></button>' +
                    '</form>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="mhs-main-area jsc-header-main">' +
          '<div class="mhs-content">' +
            '<div class="mhs-logo m-dn-sp"><a href="/pc/"><span class="cs-logo-header"></span></a></div>' +
            '<div class="mhs-logo m-dn-pc"><a href="/"><span class="cs-logo-header-sp"></span></a></div>' +
            '<div class="mhs-glonav m-dn-sp">' +
              '<ul class="jsc-nav-header">' +
                '<li><a href="/-/News/">ニュース</a></li>' +
                '<li><a href="/-/Newrelease/">ニューリリース</a></li>' +
                '<li><a href="/-/Artistlist/">アーティスト</a></li>' +
                '<li><a href="/-/Genre/">ジャンル</a></li>' +
                '<li><a href="/video/">ビデオ</a></li>' +
                '<li><a href="/-/Liveinfo/">ライブ</a></li>' +
                '<li><a href="/-/Playlist/Artist_playlist.html">プレイリスト</a></li>' +
                '<li><a href="/sns/">SNS</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="mhs-glonav m-dn-pc">' +
              '<ul>' +
                '<li><a href="javascript:void(0)" class="jsc-search-trigger"><span class="cs-icon-headersearch"></span><span class="cs-header-close"></span></a></li>' +
                '<li><a href="javascript:void(0)" class="jsc-menu-trigger"><span class="cs-icon-headermenu"></span><span class="cs-header-close"></span></a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
  // 検索メニュー
  '<form class="m-search-site jsc-search-react" method="get" action="/-/Search/">' +
  '<select name="mode">' +
  '<option value="1">アーティスト</option>' +
  '<option value="2">商品名</option>' +
  '<option value="3">楽曲名</option>' +
  '</select>' +
  '<input type="search" name="keyword" placeholder="キーワード検索">' +
  '<button type="submit"><span class="cs-icon-search"></span>検索する</button>' +
  '</form>' +
  // 検索メニュー: ここまで
  // ハンバーガーメニュー
  '<div class="m-menu-hamburger l-menu-hamburger jsc-menu-react">' +
  '<ul class="mh-nav-main">' +
  '<li><a href="/-/News/">ニュース</a></li>' +
  '<li><a href="/-/Newrelease/">ニューリリース</a></li>' +
  '<li><a href="/-/Artistlist/">アーティスト</a></li>' +
  '<li><a href="/-/Genre/">ジャンル</a></li>' +
  '<li><a href="/video/">ビデオ</a></li>' +
  '<li><a href="/-/Liveinfo/">ライブ</a></li>' +
  '<li><a href="/-/Playlist/Artist_playlist.html">プレイリスト</a></li>' +
  '<li><a href="/sns/">SNS</a></li>' +
  '</ul>' +
  '<ul class="mh-nav-sub">' +
  '<li class="is-blank"><a href="https://victor-store.jp" target="_blank" class="text-tracking-narrow">ビクターエンタテインメント オンラインストア<span class="cs-link-blankwhite"></span></a></li>' +
  '<li><a href="/-/Media/">メディア</a></li>' +
  '<li><a href="/-/Tieup/">タイアップ</a></li>' +
  '<li><a href="http://www.jvcmusic.co.jp/audition/vma/">オーディション</a></li>' +
  '</ul>' +
  '<div class="mh-share-sns">' +
  '<p>公式SNS</p>' +
  '<ul>' +
  '<li><a href="https://www.instagram.com/victor_entertainment/" target=_blank" class="cs-share-instagram cs-share-instagram-sp m-link-img"></a></li>' +
  '<li><a href="https://twitter.com/VictorMusic" class="cs-share-twitter cs-share-twitter-sp m-link-img"></a></li>' +
  '<li><a href="https://vt.tiktok.com/ZSJhFCtW1/" target=_blank" class="cs-share-tiktok cs-share-tiktok-sp m-link-img"></a></li>' +
  '<li><a href="https://www.facebook.com/jvcmusic" class="cs-share-facebook cs-share-facebook-sp m-link-img"></a></li>' +
  '<li><a href="https://timeline.line.me/user/_dRF0sgStjE09Gs_r9X5Wj4yOB-QT0ZwN5n0837M" class="cs-share-line cs-share-line-sp m-link-img"></a></li>' +
  '<li><a href="https://www.youtube.com/user/VictorMusicChannel" class="cs-share-youtube cs-share-youtube-sp m-link-img"></a></li>' +
  '</ul>' +
  '</div>' +
  '<ul class="mh-nav-sub">' +
  '<li class="is-large"><a href="/company/" target="_blank" class="text-tracking-narrow">ビクターエンタテインメントについて</a></li>' +
  '<li><a href="/company/profile.html">会社概要</a></li>' +
  '<li><a href="/company/job.html">採用情報</a></li>' +
  '<li><a href="/link/">リンク</a></li>' +
  '<li><a href="/privacy/">個人情報保護方針</a></li>' +
  '<li><a href="/help/">ヘルプ（推奨環境）</a></li>' +
  '<li><a href="/attention/">ご利用にあたって（注意事項・免責事項）</a></li>' +
  '<li><a href="/cs/">FAQ・お問い合わせ</a></li>' +
  '<li><a href="/sitemap/">サイトマップ</a></li>' +
  '<li><a href="/info/">重要なお知らせ</a></li>' +
  '</ul>' +
  '<div class="mh-read-copyright">' +
  '<p>このサイトに掲載されている記事、写真、映像等あらゆる素材の著作権法上の権利は当社が保有し、或いは管理しています。これらの素材をいかなる方法においても無断で複写・転載することは禁じられております。</p>' +
  '<small>&copy; 1999-' + new Date().getFullYear() + ' JVCKENWOOD Victor Entertainment Corp. All rights reserved.</small>' +
  '</div>' +
  '<ul class="mh-nav-sub">' +
  '<li><a href="http://www.jvckenwood.com/" target="_blank">a JVCKENWOOD Company</a></li>' +
  '</ul>' +
  '<div class="mh-btn-close">' +
  '<a href="javascript: void(0)" class="jsc-menu-trigger"><span class="cs-icon-close"></span>閉じる</a>' +
  '</div>' +
  '</div>' +
  // ハンバーガーメニュー: ここまで
      '</header>' +
  '<div class="mhs-overlay jsc-header-overlay"></div>';

document.write(header);