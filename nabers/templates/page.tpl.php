<?php

/**
 * @file
 * Returns the HTML for a single Drupal page.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728148
 */
?>

<header class="header" id="header">
    <div class="header__inner">
        <div class="header__logo">
            <div class="header__logo-wrapper">
              <?php if ($logo): ?>
                <?php
                $logo_alt = theme_get_setting('govcms_ui_kit_header_logo_alt');
                $logo_alt = !empty($logo_alt) ? $logo_alt : variable_get('site_name', 'Home');
                $logo_img = theme('image', [
                  'path' => $logo,
                  'alt' => $logo_alt,
                  'attributes' => ['class' => ['header__logo-image']],
                ]);
                $logo_class = ['header__logo-image'];
                if (empty(theme_get_setting('govcms_ui_kit_header_title'))) {
                  $logo_class[] = 'no-title';
                }

                print l($logo_img, $front_page, [
                  'html' => TRUE,
                  'attributes' => [
                    'id' => 'logo',
                    'title' => t('Back to Homepage'),
                    'rel' => 'home',
                    'class' => $logo_class,
                  ],
                ]);
                ?>
              <?php endif; ?>
            </div>
            <div id="header__nav">
              <?php print render($page['navigation']); ?>
                <nav class="header__mobile-nav">
                  <?php print render($page['mobile_navigation']); ?>
                </nav>
            </div>
            <div id="header__search">
              <?php print render($page['header']); ?>
            </div>
        </div>
    </div>
</header>

<div id="page">

  <?php
  // Render the sidebars to see if there's anything in them.
  $sidebar_first = render($page['sidebar_first']);
  $sidebar_second = render($page['sidebar_second']);
  ?>

  <?php print render($page['highlighted']); ?>

    <div id="main">
        <div id="content" class="column">
            <div class="content-header">
                <div class="content-header-inner">
                  <?php print $breadcrumb; ?>
                    <a href="#skip-link" id="skip-content"
                       class="element-invisible" tabindex="-1">Go to top of
                        page</a>
                    <a id="main-content"></a>
                  <?php if (!$is_front) : ?>
                    <?php print render($title_prefix); ?>
                    <?php if ($title): ?>
                          <h1 class="page__title title"
                              id="page-title"><?php print $title; ?></h1>
                    <?php endif; ?>
                    <?php print render($title_suffix); ?>
                  <?php endif; ?>
                  <?php if (!empty($article_date)): ?>
                      <div class="content-date">
                        <?php print render($article_date); ?>
                      </div>
                  <?php endif; ?>
                </div>
            </div>
          <?php if (!empty($article_image)): ?>
              <div class="content-image">
                <?php print render($article_image); ?>
              </div>
          <?php endif; ?>
          <?php if (!empty($featured_data_reports)): ?>
            <div class="feature-data-reports">
              <?php print render($featured_data_reports); ?>
            </div>
          <?php endif; ?>

            <div class="content-body">
              <?php print $messages; ?>
              <?php print render($tabs); ?>
              <?php print render($page['help']); ?>
              <?php if ($action_links): ?>
                  <ul class="action-links"><?php print render($action_links); ?></ul>
              <?php endif; ?>
                <div class="content-body-inner<?php print $sidebar_first ? ' has-sidebar' : ' no-sidebar'; ?>">
                  <?php if ($sidebar_first): ?>
                      <aside class="content-sidebar-first">
                        <?php print $sidebar_first; ?>
                      </aside>
                  <?php endif; ?>
                  <?php print render($page['content']); ?>
                  <?php print $feed_icons; ?>
                </div>
            </div>
        </div>
    </div>

  <?php if ($sidebar_second): ?>
      <aside class="content-sidebar-second">
        <?php print $sidebar_second; ?>
      </aside>
  <?php endif; ?>

    <div id="footer">
      <?php print render($page['footer']); ?>
    </div>

    <div class="below-footer">
      <?php print render($page['below_footer']); ?>
    </div>
</div>
<?php print render($page['bottom']); ?>
