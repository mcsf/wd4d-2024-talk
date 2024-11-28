<?php

add_action(
	'init',
	function() {
		register_meta(
			'post',
			'wd4d_book_title',
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'string',
				'sanitize_callback' => 'wp_strip_all_tags',
			)
		);
	}
);

/*
	"metadata": {
		"bindings": {
			"content": {
				"source": "core/post-meta",
				"args": {
					"key": "wd4d_book_title"
				}
			}
		}
	}
 */
