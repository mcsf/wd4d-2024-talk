<?php

/*
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/
 */

register_block_pattern(
	'demo/my-example-1',
	array(
		'title'         => __( '(WD4D) Pattern 1' ),
		'description'   => _x( 'Another way to display WD4D featured posts', 'Block pattern description'  ),
		'content'       => file_get_contents( __DIR__ . '/2-query-patterns-1.html' ),
		'categories'    => array( 'wd4d' ),
		'blockTypes'    => array( 'core/query/wd4d-featured-posts' ),
	)
);

register_block_pattern(
	'demo/my-example-2',
	array(
		'title'         => __( '(WD4D) Pattern 2' ),
		'description'   => _x( 'Another way to display WD4D featured posts', 'Block pattern description'  ),
		'content'       => file_get_contents( __DIR__ . '/2-query-patterns-2.html' ),
		'categories'    => array( 'wd4d' ),
		'blockTypes'    => array( 'core/query/wd4d-featured-posts' ),
	)
);
