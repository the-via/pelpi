enum wt_rgb_backlight_config_value
{
	id_use_split_backspace = 0x01,
	id_use_split_left_shift = 0x02,
	id_use_split_right_shift = 0x03,
	id_use_7u_spacebar = 0x04,
	id_use_iso_enter = 0x05,
	id_disable_hhkb_blocker_leds = 0x06,
	id_disable_when_usb_suspended = 0x07,
	id_disable_after_timeout = 0x08,
	id_brightness = 0x09,
	id_effect = 0x0A,
	id_effect_speed = 0x0B,
	id_color_1 = 0x0C,
	id_color_2 = 0x0D,
	id_caps_lock_indicator_color = 0x0E,
	id_caps_lock_indicator_row_col = 0x0F,
	id_layer_1_indicator_color = 0x10,
	id_layer_1_indicator_row_col = 0x11,
	id_layer_2_indicator_color = 0x12,
	id_layer_2_indicator_row_col = 0x13,
	id_layer_3_indicator_color = 0x14,
	id_layer_3_indicator_row_col = 0x15,
	id_alphas_mods = 0x16,
	id_custom_color = 0x17
};

 [
        {
            label: "Lighting",
            items: [
                {
                    label: "General",
                    items: [
                        {
                            label: "Brightness",
                            type: 'range',
                            options: [0,100],
                            content: ["brightness", 0x0106]
                        },
                        {
                            label: "Effect",
                            type: 'dropdown',
                            options: [["Off",0], ["Solid Color 1",1], ["Custom",2], ["Gradient Vertical Color 1/2",3] ],
                            content: ["effect", 4, 5],
                        },
                        {
                            label: "Effect Speed",
                            type: 'range',
                            options: [0,3],
                            content: ["effect_speed", ]
                        },
                        {
                            "showIf": "{effect} != 0",
                            "items": [
                                {
                                    label: "Color 1",
                                    type: "color",
                                    content: ["color_1", 8]
                                }
                            ]
                        },
                        {
                            "showIf": "{effect} == 2 || {effect} == 3 || {effect} == 4",
                            "items": [
                                {
                                    label: "Color 2",
                                    type: "color",
                                    content: ["color_2", 8]
                                }
                            ]
                        },





                    ]
                },
                {
                    label: "Advanced",
                    items: [
                        {
                            label: "Disable LEDs when USB is suspended",
                            type: 'toggle',
                            // options: [0,1] <- optional explicit, compiles to this? 
                            content: ["backlight_disable_when_usb_suspended", 7, 7]
                        },
                        {
                            label: "LED Sleep Timeout",
                            type: 'range',
                            options: [0,255, "mins"],
                            content: ["backlight_disable_after_timeout", 7, 8]
                        },
                        {
                            label: "Caps Lock indicator",
                            type: 'toggle',
                            options: [[255, 255], [254, 254]], // values?? lol
                            // options: [0,1] // new protocol
                            content: ["backlight_caps_lock_indicator", 7, 15]
                        },
                        {
                            label: "Caps Lock indicator color",
                            type: 'colour',
                            showIf: "backlight_caps_lock_indicator.0 == 254",
                            content: ["backlight_caps_lock_indicator_color", 7, 14]
                        },
                        {
                            label: "Layer 1 indicator",
                            type: 'toggle',
                            options: [[255, 255], [254, 254]], // values?? lol
                            // options: [0,1] // new protocol
                            content: ["backlight_layer_1_indicator", 7, 17]
                        },
                        {
                            label: "Layer 1 indicator color",
                            type: 'colour',
                            showIf: "backlight_caps_lock_indicator.0 == 254",
                            content: ["backlight_layer_1_indicator_color", 7, 16]
                        },
                    ]
                }
            ]
        }
    ]



{
    "items": [
        {
            label: "Brightness",
            type: 'range',
            options: [0,100],
            content: ["brightness", 6]
        },
        {
            "showIf": "{effect} != 0 && {effect} != 3",
            "items": [
                {
                    label: "Color 1",
                    type: "color",
                    content: ["c1", 8]
                },
                {
                    label: "Color 2",
                    type: "color",
                    content: ["c2", 9]
                },
            ]
        },

        // 0x00, 0x00, 

        {
            "items": [
                {
                    label: "Color 1",
                    type: "range", 
                    content: ["c1", 10, "{x}"],
                    template: {
                        label: "Color {x}",
                        type: "color",
                        content: ["c1", 10, "{x}"]
                    }
                },
                {
                    label: "Color {x}",
                    type: "range",
                    content: [

                    ]
                }
            ]
        }
        {
            "showIf": "{effect} == 3",
            "items": [
                {
                    label: "Color 1",
                    type: "color",
                    content: ["c1", 10, 0]
                },
                {
                    label: "Color 2",
                    type: "color",
                    content: ["c2", 10, 1]
                },
                {
                    label: "Color 3",
                    type: "color",
                    content: ["c3", 10, 2]
                },
                {
                    label: "Color 4",
                    type: "color",
                    content: ["c4", 10, 3]
                },
                {
                    label: "Color 5",
                    type: "color",
                    content: ["c5", 10, 4]
                },
                {
                    label: "Color 6",
                    type: "color",
                    content: ["c6", 10, 5]