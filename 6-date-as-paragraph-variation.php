<?php

/**
 *
 * NOTE: This variation doesn't work as of WordPress 6.7, nor Gutenberg 19.8.
 * The reason is that block bindings, as of their current implementation, are
 * implemented using standard WordPress hooks, making them inaccessible to
 * third parties which are themselves using the `editor.BlockEditor` hook. This
 * will be fixed once the following pull request is merged:
 *
 * https://github.com/WordPress/gutenberg/pull/67370
 *
 * For this talk, I made this work by using a custom Gutenberg build which
 * includes this fix. Sorry for not mentioning it during the talk!
 *
 */

add_action(
	'init',
	function() {
		register_meta(
			'post',
			'wd4d_date',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'sanitize_callback' => 'wd4d_sanitize_date',
			)
		);
	}
);

function wd4d_sanitize_date( $html ) {
	return wp_kses( $html, array(
		'time' => array(
			'class'    => array(),
			'datetime' => array(),
		),
	) );
}

add_action(
	'enqueue_block_editor_assets', 
	function () {
		$script_slug = '6-date-as-paragraph-variation';

		$metadata_path = __DIR__ . "/build/$script_slug.asset.php";
		if ( ! file_exists( $metadata_path ) ) {
			throw new Error(
				'You need to run `npm start` or `npm run build` for this plugin first.'
			);
		}
		$metadata = require $metadata_path;

		wp_enqueue_script(
			'wd4d-paragraph-date-variation',
			plugins_url( "build/$script_slug.js", __FILE__ ),
			$metadata['dependencies'],
			$metadata['version']
		);
	}
 );
