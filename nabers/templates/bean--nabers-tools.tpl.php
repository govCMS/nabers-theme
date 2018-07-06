<?php

/**
 * @file
 * bean--nabers-tools.tpl.php
 *
 * Default theme implementation for beans.
 */
?>
<div class="nabers-tools <?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <div class="content"<?php print $content_attributes; ?>>
    <div class="nabers-tools__main-link" style="background-image: url('<?php echo $bg_img_url; ?>');">
      <div class="content">
        <?php if (!empty($call_to_action_url['link_url']) && !empty($call_to_action_url['link_title'])): ?>
          <a class="wrapper-link" href="<?php echo $call_to_action_url['link_url']; ?>" title="<?php echo $call_to_action_url['link_title']; ?>">
        <?php endif; ?>
            <?php print render($content['field_link_image']); ?>
            <?php print render($content['field_call_to_action_link']); ?>
          <?php if (!empty($call_to_action_url['link_url']) && !empty($call_to_action_url['link_title'])): ?>
          </a>
          <?php endif; ?>
      </div>
    </div>
    <div class="nabers-tools__secondary-links"><?php print render($content['field_tools']); ?></div>
  </div>
</div>
