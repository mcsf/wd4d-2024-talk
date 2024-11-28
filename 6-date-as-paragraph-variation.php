<?php

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
