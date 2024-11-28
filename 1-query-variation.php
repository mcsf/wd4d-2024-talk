<?php

/*
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/
 */

add_action(
	'enqueue_block_editor_assets', 
	function () {
		wp_enqueue_script(
			'wd4d-query-variation',
			plugins_url( '1-query-variation.js', __FILE__ ),
			array( 'wp-blocks' )
		);
	}
 );

