<?php
add_action(
	'init',
	function() {
		register_block_pattern_category(
			'wd4d',
			[ 'label' => 'WD4D' ]
		);
		register_block_pattern(
			'wd4d/featured-posts',
			[
				'title'         => '(WD4D) 1+3 Query Layout',
				'categories'    => [ 'wd4d', 'about' ],
				'filePath'      => __DIR__ . '/3-pattern-with-two-queries.html',
			]
		);
	}
);
