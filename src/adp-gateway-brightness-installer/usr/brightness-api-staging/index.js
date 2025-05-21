const months = [
    'January', 
    'February', 
    'March', 
    'April',
    'May', 
    'June', 
    'July', 
    'August',
    'September', 
    'October', 
    'November', 
    'December'
];


const months_short = [
    'Jan', 
    'Feb', 
    'Mar', 
    'Apr',
    'May', 
    'Jun', 
    'Jul', 
    'Aug',
    'Sep', 
    'Oct', 
    'Nov', 
    'Dec'
];


const days = [
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wednesday',
    'Thursday', 
    'Friday', 
    'Saturday'
];


const days_short = [
    'Sun', 
    'Mon', 
    'Tue', 
    'Wed', 
    'Thu', 
    'Fri', 
    'Sat'
];


class CSSHorizontalAlignments {

    static left = "flex-start";
    static center = "center";
    static right = "flex-end";

}


class CSSVerticalAlignments {

    static top = "flex-start";
    static bottom = "flex-end";
    static middle = "center";
    static fill = "space-around";

}


class DBKeys {

    static current_file = [
        "id",
        "file_id"
    ];
    static defaults = [
        "id",
        "background_color",
        "drive",
        "flash",
        "font_size",
        "font_weight",
        "foreground_color",
        "hold_time",
        "horizontal_alignment",
        "in_mode",
        "line_spacing",
        "out_mode",
        "scroll_speed",
        "text",
        "vertical_alignment",
        "wrap"
    ];
    static dimensions = [
        "id",
        "name",
        "width",
        "height"
    ]
    static files = [
        "id",
        "file_id",
        "address_pre_filler",
        "group_",
        "sign",
        "drive",
        "folder",
        "file_"
    ]
    static playlist = [
        "id",
        "file_id"
    ];
    static row_formatting = [
        "id",
        "file_id",
        "row_id",
        "number",
        "font_weight",
        "font_size",
        "hold_time",
        "horizontal_alignment",
        "in_mode",
        "scroll_speed"
    ];
    static screen_formatting = [
        "id",
        "file_id",
        "vertical_alignment"
    ];
    static segment_formatting = [
        "id",
        "file_id",
        "row_id",
        "segment_id",
        "number",
        "foreground_color",
        "background_color",
        "flash",
        "text"
    ];
    static time = [
        "id",
        "name",
        "datetime",
        "format"
    ];
}


class FontParameters {
    
    height;
    width;

    constructor(height, width) {
        this.height = height;
        this.width = width;
        return;
    }

}


class FontSizesNormal {

    static _5 = new FontParameters(5,5);
    static _7 = new FontParameters(7,6);
    static _9 = new FontParameters(9,9);
    static _11 = new FontParameters(11,9);
    static _14 = new FontParameters(14,8);
    static _15 = new FontParameters(15,9);
    static _16 = new FontParameters(16,9);
    static _22 = new FontParameters(22,18);
    static _24 = new FontParameters(24,16);
    static _30 = new FontParameters(30,18);
    static _32 = new FontParameters(32,18);
    static _40 = new FontParameters(40,21);
    static _64 = new FontParameters(64,34);
    static _72 = new FontParameters(72,38);
    static _80 = new FontParameters(80,42);
    static _88 = new FontParameters(88,46);

}


class FontSizesBold {
    
    static _5 = new FontParameters(5,7);
    static _11 = new FontParameters(11,9);
    static _14 = new FontParameters(14,10);
    static _15 = new FontParameters(15,10);
    static _16 = new FontParameters(16,12);
    static _22 = new FontParameters(22,18);
    static _30 = new FontParameters(30,18);
    static _32 = new FontParameters(32,18);
    static _40 = new FontParameters(40,21);

}


class GetFontParameters {

    static get_width(font_size, font_weight){
        if (font_weight == "normal") {
            return FontSizesNormal[`_${font_size}`].width;
        }
        return FontSizesBold[`_${font_size}`].width;
    }

    static get_height(font_size, font_weight){
        if (font_weight == "normal") {
            return FontSizesNormal[`_${font_size}`].height;
        }
        return FontSizesBold[`_${font_size}`].height;
    }

}


class GetData {

    static last_data;
    static start_time;

    static go() {      
        fetch('api.php')
        .then(response => response.json())
        .then(data => {
            this.start_time = Date.now(); 
            if (!DataIntegrity.is_valid(data)) {
                data = this.last_data;
            }     
            if (JSON.stringify(this.last_data) == JSON.stringify(data)) {
                return;
            }   
            var cloned_data = AppTools.clone(data);
            cloned_data = ApplyDefaults.go(cloned_data);
            cloned_data = InsertCalls.go(cloned_data);
            cloned_data = SplitPages.go(cloned_data);
            cloned_data = OverflowHandler.go(cloned_data);
            // cloned_data = Intervals.go(cloned_data);  not going to use this right now but will change all js data to maps on next release.
            DrawSign.go(cloned_data);
            this.last_data = data;
        })
        .catch(error => console.error('Error fetching data:', error));
        return;
    }

    static make_time_stamp() {
        const formatting = { 
            year: 'numeric', 
            month: 'numeric', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        };
        const now = new Date(Date.now())
        var formatted = now.toISOString('en-US', formatting).replace("T", " ").replace("Z", "");
        return formatted;
    }

}


class DataIntegrity {
    
    static is_valid(data) {
        if (data === null || data === undefined) {
            return false;
        }
        for (const [key, value] of Object.entries(DBKeys)) { 
            if (data[key] == null || data[key] == undefined) {
                return false;
            } 
            if (Array.isArray(data[key])) {
                const length = data[key].length;
                if (length == 0) {
                    return false;
                }
                for (var i=0; i<data[key].length; i++) {
                    if (this.invalid_keys(data[key][i], DBKeys[key])) {
                        return false;
                    }
                }
            } else if (this.invalid_keys(data[key], DBKeys[key])) {
                return false;
            }
        }
        // if (this.playlist_is_empty(data.playlist)) {
        //     return false;
        // }
        // if (this.playlist_id_not_in_segments(data.playlist[0].file_id, data.segment_formatting)) {
        //     return false;
        // }
        return true;
    }

    static invalid_keys(data, control) {
        const data_keys = JSON.stringify(Object.keys(data));
        const control_ = JSON.stringify(control);
        const mismatch = data_keys !== control_;
        return mismatch;
    }

    static playlist_is_empty(playlist) {
        if (Object.keys(playlist[0]).length == 0) {
            return true;
        }
    }

    static playlist_id_not_in_segments(id, segments) {
        for (const segment of segments) {
            if (segment.file_id == id) {
                return false;
            }
        }
        return true;
    }

}


class ApplyDefaults {

    static go(data) {
        data.dimensions = this.apply_dimensions(data.dimensions);
        data.row_formatting = this.apply_rows(data.row_formatting, data.defaults);
        data.screen_formatting = this.apply_screens(data.screen_formatting, data.defaults);
        data.segment_formatting = this.apply_segments(data.segment_formatting, data.defaults);
        return data;
    }

    static apply_dimensions(dimensions) {
        if (this.is_invalid(dimensions.height)) {
            dimensions.height = 18;
        }
        if (this.is_invalid(dimensions.width)) {
            dimensions.width = 36;
        }
        return dimensions;
    }

    static apply_rows(rows, defaults) {
        for (var row of rows) {
            if (this.is_invalid(row.font_size)) {
                row.font_size = defaults.font_size;
            }
            if (this.is_invalid(row.font_weight)) {
                row.font_weight = defaults.font_weight;
            }
            if (this.is_invalid(row.hold_time)) {
                row.hold_time = defaults.hold_time;
            }
            if (this.is_invalid(row.horizontal_alignment)) {
                row.horizontal_alignment = defaults.horizontal_alignment;
            }
            if (this.is_invalid(row.in_mode)) {
                row.in_mode = defaults.in_mode;
            }
            if (this.is_invalid(row.scroll_speed)) {
                row.scroll_speed = defaults.scroll_speed;
            }
        }
        return rows;
    }

    static apply_screens(screens, defaults) {
        for (var screen of screens) {
            if (this.is_invalid(screen.vertical_alignment)) {
                screen.vertical_alignment = defaults.vertical_alignment;
            }
        }
        return screens;
    }

    static apply_segments(segments, defaults) {
        for (var segment of segments) {
            if (this.is_invalid(segment.background_color)) {
                segment.background_color = defaults.background_color ;
            }
            if (this.is_invalid(segment.flash)) {
                segment.flash = defaults.flash ;
            }
            if (this.is_invalid(segment.foreground_color)) {
                segment.foreground_color = defaults.foreground_color;
            }
        }
        return segments;
    }

    static is_invalid(value) {
        return value === null || value === undefined;
    }

}


class DataChangeDetector {

    static data;

    static change_in_data(data) {
        if (this.data === undefined) {
            return true;
        }
        for (const[key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
                for (var i=0; i<value.length; i++) {
                    if (this.has_changed(value[i], this.data[key][i])) {
                        return true;
                    }
                }
            } else if (this.has_changed(value, this.data[key])) {
                return true;
            }
        }
        return false;
    }
    
    static has_changed(current, last) {
        if (current == null || current == undefined) {
            return true;
        }
        if (last == null || last == undefined) {
            return true;
        }
        const current_keys = Object.keys(current);
        const last_keys = Object.keys(last);
        if (JSON.stringify(current_keys) === JSON.stringify(last_keys)) {
            for (const key of current_keys) {
                if (current[key] !== last[key]) {
                    return true;
                }
            }
        } 
        return false;
    }

}


class GetNowPlayingID {

    static last_time = new Date().getTime();
    static delta_time = 0;
    static playlist_index = 0;
    static file_id;
    static file_id_extension; 

    static generate_file_id(data) {
        const hold_time = this.get_hold_time(data);
        this.delta_time += this.calculate_time_delta(); 
        if (this.delta_time/1000 >= hold_time) {
            this.playlist_index = this.increment_playlist_index(data);
            this.delta_time = 0;
        }
        this.file_id = data.playlist[this.playlist_index].file_id;
        return this.file_id;
    }

    static generate_file_id_extension(data) {
        return this.file_id_extension;
    }

    static reset() {
        this.playlist_index = 0;
        this.file_id = null;
        this.file_id_extension = null;
        return;
    }

    static calculate_time_delta() {
        const current_time = new Date().getTime();
        const delta = current_time - this.last_time; 
        this.last_time = current_time; 
        return delta;    
    }

    static get_hold_time(data) {
        const hold_time = data.screen_formatting[this.playlist_index].hold_time;
        const default_ = data.defaults.hold_time;
        if (default_ === null) {
            return 3;
        }
        if (hold_time === null) {
            return default_ * 1;
        }
        return hold_time * 1;
    }

    static increment_playlist_index(data) {
        if (data.playlist === null) {
            return null;
        }
        if (data.playlist === undefined) {
            return null;
        }
        const playlist_length = data.playlist.length;
        if (playlist_length === 0) {
            return null;
        }
        var index = this.playlist_index;
        if (index === undefined){
            return 0;
        }
        if (index === null) {
            return 0;
        }
        index++;
        if (index >= playlist_length) {
            index = 0;
        }
        return index;
    }
    
}


class InsertCalls {
    
    static data;

    static go(data) {
        this.data = AppTools.clone(data);
        var segments = AppTools.get_text_segments(this.data);
        var strings = AppTools.get_string_segments(this.data);
        var segment = segments.head;
        while (segment !== null) {
            segment.data.text = this.replace_date_time(segment.data.text);
            this.insert_string_segments(segment, strings, segments);
            segment = segment.next;
        }
        var new_segment_array = [...segments.to_array(), ...strings];
        this.data.segment_formatting = new_segment_array;
        return this.data;
    }

    static replace_date_time(original) {  
        if (!this.flag_present(original)) {
            return original;
        }
        const [left, setting, right] = this.split_around_flag(original);
        if (setting.includes("call")) {
            return original;
        }
        if (setting.includes("new_page")) {
            return original;
        }
        var new_ = "";
        if (setting.includes("date")) {
            new_ = DateTimeInserter.date(setting);
        }
        if (setting.includes("time")) {
            new_ = DateTimeInserter.time(this.data.time.format);
        }
        original = `${left}${new_}${right}`;
        if (right.length > 0) {
            original = this.replace_date_time(original);
        }
        return original;
    }

    static insert_string_segments(segment, strings, segments) {  
        if (!this.flag_present(segment.data.text)) {
            return;
        }
        var [left, setting, right] = this.split_around_flag(segment.data.text);
        if (setting.includes("date")) {
            return;
        }
        if (setting.includes("time")) {
            return;
        }
        if (setting.includes("new_page")) {
            return;
        }        
        const file = setting.split(":")[1];
        const string_id = this.full_string_id(file, segment.data.file_id);
        var new_segment_data = this.get_string_segment(string_id, strings, segment.data);
        new_segment_data = this.update_string_segment(new_segment_data, segment.data);
        if (left == "") {
            segment.data = new_segment_data;
        } else {
            var left_segment_data = AppTools.clone(segment.data);
            left_segment_data.text = left;
            segment.data = left_segment_data;
            segments.insert_after(segment.data, new_segment_data);
        }
        
        if (right != "") {
            var right_segment_data = AppTools.clone(segment.data);
            var number = parseInt(new_segment_data.number) + 1;
            right_segment_data.number = `${number}`;
            var id = right_segment_data.segment_id;
            id = id.slice(0, -3);
            id += String(number).padStart(3, '0');
            right_segment_data.segment_id = id;
            right_segment_data.text = right;
            segments.insert_after(new_segment_data, right_segment_data);
            segment = segments.get_node(right_segment_data);
            this.insert_string_segments(segment, strings, segments);
        }
        return;
    }

    static flag_present(text) {
        if (text === undefined) {
            return false;
        }
        if (text === null) {
            return false;
        }
        if (!text.includes("[[[")) {
            return false;
        }
        if (!text.includes("]]]")) {
            return false;
        }
        return true;
    }

    static full_string_id(id, host_id) {
        const prefix = host_id.slice(0, 5);
        if (id.length == 1) {
            return `${prefix}DS${id}`;
        }
        return `${prefix}${id}`
    }

    static get_string_segment(string_id, strings) {
        var this_string = null;
        for (var i=0; i<strings.length; i++) {
            if (strings[i].file_id != string_id) {
                continue;
            }
            return AppTools.clone(strings[i]);
        }
        return null;
    }

    static update_string_segment(segment, host_segment) {
        segment.file_id = host_segment.file_id;
        segment.row_id = host_segment.row_id;
        var number = parseInt(host_segment.number) + 1;
        segment.number = `${number}`;
        segment.segment_id = IDTools.increment_id(host_segment.segment_id);
        if (segment.background_color == null) {
            segment.background_color = host_segment.background_color;
        }
        if (segment.flash == null) {
            segment.flash = host_segment.flash;
        }
        if (segment.foreground_color == null) {
            segment.foreground_color = host_segment.foreground_color;
        }
        return segment;
    }

    static split_around_flag(text) {
        var index = text.indexOf("[[[");
        if (index < 0) {
            return ["", text, ""];
        }
        const left = text.slice(0, index)
        text = text.slice(index);
        index = text.indexOf("]]]");
        const setting = text.slice(3, index);
        const right = text.slice(index + 3);
        return [left, setting, right];
    }

}


class DateTimeInserter {

    static date(text){
        CurrentDateTime.update();
        const format = text.split(":")[1]
        switch (format) {
            case '0':
                return `${CurrentDateTime.month}/${CurrentDateTime.date}/${CurrentDateTime.year_short}`;
                break;
            case '1':
                return `${CurrentDateTime.day}/${CurrentDateTime.month}/${CurrentDateTime.year_short}`;
                break;
            case '2':
                return `${CurrentDateTime.month}-${CurrentDateTime.date}-${CurrentDateTime.year_short}`;
                break;
            case '3':
                return `${CurrentDateTime.date}-${CurrentDateTime.month}-${CurrentDateTime.year_short}`;
                break;
            case '4':
                return `${CurrentDateTime.month}.${CurrentDateTime.date}.${CurrentDateTime.year}`;
                break;
            case '5':
                return `${CurrentDateTime.year_short}`;
                break;
            case '6':
                return `${CurrentDateTime.year}`;
                break;
            case '7':
                return `${CurrentDateTime.month}`;
                break;
            case '8':
                return `${CurrentDateTime.month_short}`;
                break;
            case '9':
                return `${CurrentDateTime.day_short}`;
                break;
            case 'A':
                return `${CurrentDateTime.date}`;
                break;
            case 'B':
                return `${CurrentDateTime.day}`;
                break;
            case 'C':
                return `${CurrentDateTime.hour}`;
                break;
            case 'D':
                return `${CurrentDateTime.minute}`;
                break;
            case 'E':
                return `${CurrentDateTime.second}`;
                break;
            case 'G':
                return `${CurrentDateTime.hour_24}:${CurrentDateTime.minute}`;
                break;
            case 'a':
                return `${CurrentDateTime.hour_12}:${CurrentDateTime.minute}`;
                break;
            case 'b':
                return `${CurrentDateTime.hour_24}:${CurrentDateTime.minute}`;
                break;
            default:
                return 'invalid option';
                break;
          }
          return "invalid code";
    }

    static time(format) {
        CurrentDateTime.update();
        switch (format) {
            case '24':
                return `${CurrentDateTime.hour_24}:${CurrentDateTime.minute}:${CurrentDateTime.second}`;
                break;
            case '12':
                return `${CurrentDateTime.hour_12}:${CurrentDateTime.minute}:${CurrentDateTime.second}`;
                break;
            default:
                return 'invalid option';
        }
        return 'invalid argument';
    }

}


class SplitPages {

    static files;
    static playlist;
    static rows;
    static screens;
    static segments;
    static used_ids;

    static go(data) {
        // CONVERT TO LINKED LISTS
        this.files = new LinkedList(data.files);
        this.playlist = new LinkedList(data.playlist);
        this.rows = new LinkedList(data.row_formatting);
        this.screens = new LinkedList(data.screen_formatting);
        this.segments = new LinkedList(data.segment_formatting);
        this.used_ids = this.generate_used_ids();
        // SPLIT PAGES
        var segment = this.segments.head;
        while (segment != null) {
            if (!this.flag_present(segment.data.text)) {
                segment = segment.next;
                continue;
            }
            this.split(segment);
            segment = segment.next;
            continue;
        }
        // CONVERT BACK TO ARRAYS
        data.files = this.files.to_array();
        data.playlist = this.playlist.to_array();
        data.row_formatting = this.rows.to_array();
        data.screen_formatting = this.screens.to_array();
        data.segment_formatting = this.segments.to_array();
        return data;
    }

    static generate_used_ids() {
        var file = this.files.head;
        var used_ids = new Map();
        while (file != null) {
            used_ids.set(file.data.file_id.slice(-2), null);
            file = file.next;
            continue;
        }
        return used_ids;
    }

    static flag_present(text) {
        if (text === undefined || text === null) {
            return false;
        }
        const flag_found = text.includes("[[[new_page]]]");
        return flag_found;
    }

    static split(segment) {
        // CLONES
        var file = this.get_file_by_id(segment.data.file_id);
        var file_ = file.extract_clone(file);
        var playlist_element = this.get_playlist_element_by_id(segment.data.file_id);
        if (playlist_element != null) {
            var playlist_element_ = playlist_element.extract_clone();
        }
        var row = this.get_row_by_id(segment.data.row_id);
        var row_ = row.extract_clone();
        var screen = this.get_screen_by_id(segment.data.file_id);
        var screen_ = screen.extract_clone();
        var segment_ = segment.extract_clone();
        // SPLIT TEXT
        [segment.data.text, segment_.data.text] = this.split_text(segment.data.text);
        // NEW IDS
        const new_file_id = this.generate_new_file_id(segment.data.file_id);
        const new_row_id = `${new_file_id}000`;
        const new_segment_id = `${new_row_id}000`;
        file_.data.file_id = new_file_id;
        if (playlist_element != null) {
            playlist_element_.data.file_id = new_file_id;
        }
        row_.data.file_id = new_file_id;
        row_.data.number = "0";
        row_.data.row_id = new_row_id;
        screen_.data.file_id = new_file_id;
        segment_.data.file_id = new_file_id;
        segment_.data.row_id = new_row_id;
        segment_.data.segment_id = new_segment_id;
        // CASCADE CHANGES
        this.cascade_row_data(row.next, file.data.file_id, new_file_id);
        this.cascade_segments(segment.next, file.data.file_id, new_file_id, row.data.row_id);
        // INSERT
        file.insert_after_me(file_);
        if (playlist_element != null) {
            playlist_element.insert_after_me(playlist_element_);
        }
        row.insert_after_me(row_);
        screen.insert_after_me(screen_);
        segment.insert_after_me(segment_);
        return;
    }

    static get_file_by_id(id) {
        var file = this.files.head;
        while (file != null) {
            if (file.data.file_id == id) {
                return file;
            }
            file = file.next;
            continue;
        }
        return null;
    }

    static get_playlist_element_by_id(id) {
        var node = this.playlist.head;
        while (node != null) {
            if (node.data.file_id == id) {
                return node;
            }
            node = node.next;
            continue;
        }
        return null;
    }

    static get_row_by_id(id) {
        var row = this.rows.head;
        while (row != null) {
            if (row.data.row_id == id) {
                return row;
            }
            row = row.next;
            continue;
        }
        return null;
    }

    static get_screen_by_id(id) {
        var screen = this.screens.head;
        while (screen != null) {
            if (screen.data.file_id == id) {
                return screen;
            }
            screen = screen.next;
            continue;
        }
        return null;
    }

    static split_text(text) {
        const flag = "[[[new_page]]]";
        const flag_position = text.indexOf(flag);
        const left = text.slice(0, flag_position).trim();;
        const right = text.slice(flag_position + flag.length).trim();
        return [left, right];
    }

    static generate_new_file_id(id) {
        const left = id.slice(0,-2);
        const right = id.slice(-2);
        const new_id = this.generate_file_id_suffix(right);
        return `${left}${new_id}`;
    }

    static generate_file_id_suffix(id) {
        var new_id = this.propose_new_id(id);
        if (this.used_ids.has(new_id)) {
            new_id = this.generate_new_file_id(new_id);
        }
        return new_id;
    }

    static propose_new_id(id) {
        var left = id.slice(-2,-1);
        left = left.charCodeAt(0);
        var right = id.slice(-1);
        right = right.charCodeAt(0);
        if (right < 125) {
            return `${String.fromCharCode(left)}${String.fromCharCode(right+1)}`;
        }
        if (left < 125) {
            return `${String.fromCharCode(left+1)}${String.fromCharCode(32)}`;
        }
        return null;
    }

    static cascade_row_data(row, target_file_id, new_file_id) {
        var row_number = 1; // starts at 1 because newly created page's 0 row will be the split row and this is the row after that
        while (row != null) {
            if (row.data.file_id != target_file_id) {
                return;
            }
            row.data.file_id = new_file_id;
            const saved_row_id = row.data.row_id;
            const new_row_id = `${new_file_id}${String(row_number).padStart(3, "0")}`;
            row.data.row_id = new_row_id;
            row.data.number = row_number;            
            row_number ++;
            row = row.next;
            continue;
        }
        return;
    }

    static cascade_segments(segment, target_file_id, new_file_id, old_row_id) {
        var segment_number = 1;  // starts at 1 because the inserted segment will be a new row and seg 0, this segment is after the inserted.
        while (segment != null) {
            if (segment.data.file_id != target_file_id) {
                return;
            }
            Segments.change_file_part_of_segment(segment.data, new_file_id);
            const old_row_number = parseInt(old_row_id.slice(-3))
            const new_row = Segments.decrement_row_id(segment.data, old_row_number);
            Segments.change_row_part_of_segment(segment.data, new_row)
            segment_number = String(segment_number).padStart(3, "0");
            // segment.data.segment_id = `${segment.data.row_id}${segment_number}`;
            // segment_number = parseInt(segment_number);
            segment_number ++;
            segment = segment.next;
            continue;
        }
    }

}


class CurrentDateTime {

    static year;
    static year_short;
    static month;
    static month_text;
    static month_short;
    static date;
    static hour_24;
    static hour_12;
    static minute;
    static second;
    static day;
    static day_text;
    static day_short;

    static update() {
        const date = new Date();
        this.year = date.getFullYear().toString();
        this.year_short = this.year.slice(-2);
        this.month = date.getMonth() + 1;
        this.month_text = months[this.month-1];
        this.month_short = months_short[this.month-1];
        this.date = date.getDate();
        this.hour_24 = date.getHours();
        this.hour_12 = this.hour_24 > 12 ? this.hour_24 - 12 : this.hour_24
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
        this.day = date.getDay();
        this.day_text = days[this.day-1];
        this.day_short = days_short[this.day-1];
        return;
    }

}


class OverflowHandler {

    static screen_width;
    static screen_height;
    static segments;
    static rows;
    static files;
    static screens;
    static plyalist;

    static go(data) {
        // copy to local data
        this.screen_width = this.get_width(data);
        this.screen_height = this.get_height(data);
        this.files = new LinkedList(data.files);
        this.playlist = new LinkedList(data.playlist);
        this.rows = new LinkedList(data.row_formatting);
        this.screens = new LinkedList(data.screen_formatting);
        this.segments = AppTools.get_text_segments(data);
        // operations
        this.row_overflow_handler();
        this.screen_overflow_handler();
        // overwrite existing data
        data.files = this.files.to_array();
        data.playlist = this.playlist.to_array();
        data.row_formatting = this.rows.to_array();
        data.screen_formatting = this.screens.to_array();
        data.segment_formatting = this.segments.to_array();
        return data;
    }

    static get_width(data) {
        if (data.dimensions.width === null) {
            return 36;
        }
        return parseInt(data.dimensions.width);
    }

    static get_height(data) {
        if (data.dimensions.height == null) {
            return 18;
        }
        return parseInt(data.dimensions.height);
    }

    static row_overflow_handler() {
        var segment = this.segments.head;
        var row;
        var font_width = 0;
        var segment_width = 0;
        var remaining = this.screen_width;
        while (segment !== null) {
            row = this.get_row_by_id(segment.data.row_id);
            if (row.data.in_mode != "hold") {
                segment = segment.next;
                continue;
            }
            font_width = GetFontParameters.get_width(row.data.font_size, row.data.font_weight);
            segment_width = Segments.calculate_width(row.data, segment.data);
            remaining -= segment_width;
            if (remaining < 0) {
                this.segment_splitter(segment, row, font_width, remaining, segment_width);
                remaining = this.screen_width;
            } else if (segment.next !== null && segment.next.data.row_id != segment.data.row_id) {
                remaining = this.screen_width;
            }
            segment = segment.next;
            continue;
        }
        return;
    }    

    static get_row_by_id(id) {
        var row = this.rows.head;
        while (row.data.row_id != id) {
            row = row.next;
        }
        return row;
    }

    static calculate_row_width (row, segments) {
        const row_id = row.row_id;
        var text_width;
        var font_width;
        var segment = segments.head;
        while (segment !== null) {
            if (segment.data.row_id != row_id) {
                segment = segment.next;
                continue;
            }
            if (segment.data.text === null) {
                segment = segment.next;
                continue;
            }
            if (segment.data.text === undefined) {
                segment = segment.next;
                continue;
            }
            text_width = Segments.calculate_width(row.data, segment.data);
            segment = segment.next;
        }
        return text_width;
    }

    static segment_splitter(segment, row, character_width, remaining, segment_width) {
        var new_segment;
        var evaluate_id;
        var last_row_id;
        var new_row;
        var number;
        if(!row.data.hasOwnProperty('extends_row')) {
            row.data.extends_row = row.data.row_id;
        }
        if (!segment.data.hasOwnProperty('extends_row')) {
            segment.data.extends_row = segment.data.row_id;
        }
        remaining = remaining + segment_width;
        const [left, right] = this.wrap_text(segment.data.text, remaining, character_width);
        // NEW ROW
        new_row = AppTools.clone(row);
        new_row.data.row_id = IDTools.increment_id(new_row.data.row_id);
        new_row.data.number = String(parseInt(new_row.data.row_id.slice(-3)));
        row.next = new_row;
        var row_ = new_row.next;
        while (row_ !== null) {
            if (row_.data.file_id != new_row.data.file_id) {
                row_= row_.next;
                continue;
            }
            row_.data.row_id = IDTools.increment_id(row_.data.row_id);
            row_.data.number = String(parseInt(row_.data.row_id.slice(-3)));
            row_ = row_.next;
        }
        // NEW SEGMENT
        segment.data.text = left;
        new_segment = AppTools.clone(segment);
        new_segment.data.text = right;
        new_segment.data.row_id = IDTools.increment_id(new_segment.data.row_id);
        new_segment.data.segment_id = new_segment.data.row_id + "000";
        new_segment.data.number = "0";
        segment.next = new_segment;
        var seg = new_segment.next;
        while (seg !== null) {
            if (seg.data.file_id != new_segment.data.file_id) {
                seg = seg.next;
                continue;
            }
            seg.data.row_id = IDTools.increment_id(seg.data.row_id);
            seg.data.segment_id = seg.data.row_id + seg.data.number.padStart(3, '0');
            seg = seg.next;
        }
        return;
    }

    static wrap_text(text, remaining, character_width){
        var left = "";
        var right = "";
        var text_width = 0;
        var last_character;
        var second_to_last;
        var next_character;
        while (text_width < remaining - character_width - 1 && text != "") {
            left += text.slice(0, 1);
            text = text.slice(1);
            text_width = left.length * (character_width + 1);
        }
        last_character = left.slice(-1);
        second_to_last = left.slice(-2,-1);
        next_character = text.slice(0, 1);
        if (last_character == " " || last_character == "-") {
            right = text;
        } else if (second_to_last == " "  || second_to_last == "-") {
            right = left.slice(-1) + text;
            left = left.slice(0, -1) + " ";
        } else if (next_character == " " || next_character == "-") {
            right = text;
        } else {
            right = left.slice(-1) + text;
            left = left.slice(0, -1) + "-";
        }
        return [left, right];
    }

    static screen_overflow_handler() {
        var row = this.rows.head;
        var font_height;
        var total_height = 0;
        var extended_file_index = 0;
        var extension;
        var extended_file_id = row.data.file_id;
        var target = row.data.file_id;
        var last_row = row;
        var transitions = [];
        var transition_row;
        const screen_heights = new Map();
        var screen = this.screens.head;
        while (screen != null) {
            const height = Screens.calculate_used_screen_height(screen, this.rows)
            screen_heights.set(screen.data.file_id, height);
            screen = screen.next;
            continue;
        }
        while (row != null) {           
                if (row.data.in_mode != "hold") {
                    row = row.next;
                    continue;
                }
                if (row.data.hasOwnProperty('extends_row') && row.data.row_id != row.data.extends_row) {
                    row = row.next;
                    continue;
                }
                if (screen_heights.get(row.data.file_id) < this.screen_height) {
                    row = row.next;
                    continue;
                }
                // file insertion never occurs on new file id
                if (row.data.file_id != last_row.data.file_id) {
                    transition_row = AppTools.clone(last_row);
                    transition_row.data.file_id = target;
                    transitions.push(transition_row);
                    total_height = 1+ GetFontParameters.get_height(row.data.font_size, row.data.font_weight);
                    extended_file_index = 0;
                    target = row.data.file_id;
                    last_row = row;
                    row = row.next;
                    continue;
                }
                // single line screen overflow
                font_height = GetFontParameters.get_height(row.data.font_size, row.data.font_weight);
                if (font_height > this.screen_height) {
                    // insert when the next row is in the same file
                    if (row.next != null && row.data.file_id == row.next.data.file_id) {      
                        extension = String.fromCharCode(extended_file_index + 97);
                        extended_file_id = row.data.file_id + extension;
                        this.insert_into_list(this.files, target, extended_file_id);
                        this.insert_into_list(this.screens, target, extended_file_id);
                        if (AppTools.file_id_in_playlist(row.data.file_id, this.playlist)) {
                            this.insert_into_list(this.playlist, target, extended_file_id);
                        }
                        transition_row = AppTools.clone(last_row);
                        transition_row.data.file_id = target;
                        transitions.push(transition_row);
                        total_height = 0;   
                        extended_file_index ++;
                        target = extended_file_id;
                        last_row = row;
                        row = row.next;
                        continue;
                    }
                    // do not insert when the next row is in the same file
                    total_height = 0;
                    extended_file_index = 0;
                    if (row.next === null) {
                        row = row.next;
                        continue;
                    }
                    target = row.next.data.file_id;
                    last_row = row;
                    row = row.next;
                    continue;
                }
                // single line does not overflow, keep track of total height
                total_height += font_height + 1;
                // this row does not overflow screen
                if (total_height <= this.screen_height){
                    last_row = row;
                    row = row.next;
                    continue;
                }  
                // this row overflows screen    
                extension = String.fromCharCode(extended_file_index + 97);
                extended_file_id = row.data.file_id + extension;
                this.insert_into_list(this.files, target, extended_file_id);
                this.insert_into_list(this.screens, target, extended_file_id);
                if (AppTools.file_id_in_playlist(row.data.file_id, this.playlist)) {
                    this.insert_into_list(this.playlist, target, extended_file_id);
                }
                transition_row = AppTools.clone(last_row);
                transition_row.data.file_id = target;
                transitions.push(transition_row);
                total_height = font_height + 1;   
                extended_file_index ++;
                target = extended_file_id;
                last_row = row;
                row = row.next;
                continue;
            }
        transition_row = AppTools.clone(last_row);
        transition_row.data.file_id = extended_file_id;
        transitions.push(transition_row);
        transitions = TransitionMap.generate(transitions);
        this.update_rows_and_segments(transitions);
    }

    static insert_into_list(list, target, extended_file_id) {
        const node = target === null ? list.head : this.get_node_from_list_by_id(list, target);
        if (node === null || node === undefined) {
            return;
        }
        var data = AppTools.clone(node.data);
        data.file_id = extended_file_id;
        list.insert_after(node.data, data);
        return;
    }

    static get_node_from_list_by_id(list, target) {
        var this_node = list.head;
        while (this_node !== null && this_node.data.file_id != target) {
            this_node = this_node.next;
        }
        return this_node;
    }

    static update_rows_and_segments(transitions) {
        for (var i=0; i<transitions.length; i++) {
            const t = transitions[i];   
            var row = this.rows.head;
            while(row !== null) {
                const start = parseInt(t.first_number);
                const stop = parseInt(t.last_number);
                const current = parseInt(row.data.number);
                if (row.data.file_id != t.clean_file_id || current < start || current > stop) {
                    row = row.next;
                    continue;
                }
                const saved_row_id = row.data.row_id;
                this.update_row(row, t);
                this.row_number_cascade(row);
                this.update_segments(saved_row_id, row);
                row = row.next;
            }
        }
    }

    static update_row(row, map) {
        row.data.file_id = map.extended_file_id;
        const number = parseInt(row.data.number);
        const start = parseInt(map.first_number);
        row.data.number = String(number - start);
        row.data.row_id = row.data.file_id;
        row.data.row_id += row.data.number.padStart(3, '0');
        return;
    }

    static row_number_cascade(row_) {
        const base_number = parseInt(row_.data.number);
        const base_id = row_.data.row_id;
        var row = row_.next;
        while(row !== null) {
            const this_id = row.data.row_id;
            const this_number = parseInt(row.data.number);
            if (this_id == base_id) {
                row.data.number = base_number + this_number;
            }
            row = row.next
        }
    }

    static update_segments(saved_row_id, row) {
        var segment = this.segments.head;
        var offset = 0;
        while (segment !== null) {
            if (segment.data.row_id == saved_row_id) {
                segment.data.file_id = row.data.file_id;
                segment.data.row_id = row.data.row_id;
                segment.data.segment_id = segment.data.row_id + segment.data.number.padStart(3, '0');
            }
            segment = segment.next;
        }
        return;
    }

}


class TransitionMap {

    clean_file_id;
    extended_file_id;
    first_number;
    last_number;

    constructor(clean, extended, first, last) {
        this.clean_file_id = clean;
        this.extended_file_id = extended;
        this.first_number = first;
        this.last_number = last;
        return;
    }

    static generate(rows) {
        var maps = [];
        for (var i=0; i<rows.length; i++) {
            const row = rows[i];
            const start = this.determine_start(i, rows);
            const map = new TransitionMap(
                AppTools.clean_id(row.data.file_id),
                row.data.file_id,
                start,
                row.data.number
            );
            maps.push(map);
        }
        return maps;
    }

    static determine_start(index, rows) {
        if (index == 0) {
            return "0";
        }
        const last_clean = AppTools.clean_id(rows[index-1].data.file_id);
        const this_clean = AppTools.clean_id(rows[index].data.file_id);
        if (this_clean != last_clean) {
            return "0";
        }
        return String(parseInt(rows[index-1].data.number) + 1);
    }
    
}


class IDTools {

    static increment_id(id) {        
        var number = parseInt(id.slice(-3)) + 1;
        number = String(number).padStart(3, '0');
        id = id.slice(0, -3);
        id = `${id}${number}`;
        return id;
    }
}


class DrawSign {
    
    static data;
    static playlist_map;
    static now_playing;
    static CODES = {
        ' ': '0020',
        '!': '0021',
        '"': '0022',
        '#': '0023',
        '$': '0024',
        '%': '0025',
        '&': '0026',
        '\'': '0027',
        '(': '0028',
        ')': '0029',
        '*': '002A',
        '+': '002B',
        ',': '002C',
        '-': '002D',
        '.': '002E',
        '/': '002F',
        '0': '0030',
        '1': '0031',
        '2': '0032',
        '3': '0033',
        '4': '0034',
        '5': '0035',
        '6': '0036',
        '7': '0037',
        '8': '0038',
        '9': '0039',
        ':': '003A',
        ';': '003B',
        '<': '003C',
        '=': '003D',
        '>': '003E',
        '?': '003F',
        '@': '0040',
        'A': '0041',
        'B': '0042',
        'C': '0043',
        'D': '0044',
        'E': '0045',
        'F': '0046',
        'G': '0047',
        'H': '0048',
        'I': '0049',
        'J': '004A',
        'K': '004B',
        'L': '004C',
        'M': '004D',
        'N': '004E',
        'O': '004F',
        'P': '0050',
        'Q': '0051',
        'R': '0052',
        'S': '0053',
        'T': '0054',
        'U': '0055',
        'V': '0056',
        'W': '0057',
        'X': '0058',
        'Y': '0059',
        'Z': '005A',
        '[': '005B',
        '\\': '005C',
        ']': '005D',
        '^': '005E',
        '_': '005F',
        '`': '0060',
        'a': '0061',
        'b': '0062',
        'c': '0063',
        'd': '0064',
        'e': '0065',
        'f': '0066',
        'g': '0067',
        'h': '0068',
        'i': '0069',
        'j': '006A',
        'k': '006B',
        'l': '006C',
        'm': '006D',
        'n': '006E',
        'o': '006F',
        'p': '0070',
        'q': '0071',
        'r': '0072',
        's': '0073',
        't': '0074',
        'u': '0075',
        'v': '0076',
        'w': '0077',
        'x': '0078',
        'y': '0079',
        'z': '007A',
        '{': '007B',
        '|': '007C',
        '}': '007D',
        '~': '007E'
    };

    static go(data) {
        this.data = data;
        this.playlist_map = Playlist.create_map(this.data.playlist);
        // this.now_playing = this.generate_now_playing();
        this.set_sign_style();
        this.clear_sign();
        this.make_dimmer();
        this.make_screens(this.data.playlist);
        this.set_screens_vertical_alignment(this.data.screen_formatting);
        this.calculate_widths(this.data.row_formatting, this.data.segment_formatting);
        this.set_overflown_flags(this.data.row_formatting);
        this.override_horizontal_alignments(this.data.row_formatting, this.data.dimensions.width);
        AnimationParameters.generate(this.data);
        AnimateScreens.animate();
        this.generate_key_frames(
            AnimationParameters.screen_cycle,
            AnimationParameters.full_cycle,
            this.data.defaults.hold_time,
            AnimationParameters.screens
        );      
        var rows = this.data.row_formatting;
        var segments = this.data.segment_formatting;
        for (var row of rows) {
            if (!this.playlist_map.has(row.file_id)) {
                continue;
            }
            var screen = document.getElementById(row.file_id);
            screen.appendChild(this.draw_row(row, segments, this.data.dimensions));
        }
        return;
    }

    static generate_now_playing(){
        const file_id = GetNowPlayingID.generate_file_id(this.data);
        return new InterfaceNowPlaying(this.data, file_id);
    }

    static set_sign_style() {
        var element = document.getElementById("sign");
        const width = this.data.dimensions.width;
        const height = this.data.dimensions.height;
        element.style.setProperty('--width', `${width}px`);
        element.style.setProperty('--height', `${height}px`);
        return;
    }

    static clear_sign() {
        document.getElementById("sign").innerHTML = "";
        var head = document.head;
        var style_elements = head.getElementsByTagName("style");
        for (var i = style_elements.length - 1; i>=0; i--) {
            var style_element = style_elements[i];
            style_element.parentNode.removeChild(style_element);
        }
        return;
    }

    static make_dimmer() {
        const e = document.createElement("div");
        e.id = "dimmer";
        e.style.width = `${this.data.dimensions.width}px`;
        e.style.height = `${this.data.dimensions.height}px`;
        e.style.position = "absolute";
        e.style.backgroundColor = "black";
        var brightness = this.data.brightness.value;
        brightness = parseFloat(brightness);
        brightness = 1 - brightness;
        brightness *= 100;
        brightness = Math.round(brightness);
        brightness /= 100;
        brightness = String(brightness);
        e.style.opacity = brightness;
        e.style.zIndex = "100";
        document.getElementById("sign")?.appendChild(e);
        return;
    }

    static make_screens(playlist) {
        var sign = document.getElementById("sign");
        var first = true;
        for (var file of playlist) {
            var screen = document.createElement('div');
            screen.style.width = `${this.data.dimensions.width}px`;
            screen.setAttribute('id', file.file_id);
            if (!first) {
                screen.style.visibility = "hidden";
            }
            first = false;
            sign.appendChild(screen);
        }
    }

    static set_screens_vertical_alignment(screens) {
        for (var screen of screens) {
            if (!this.playlist_map.has(screen.file_id)) {
                continue;
            }
            var div = document.getElementById(screen.file_id);
            div.classList.add("screen");
            const alignment = CSSVerticalAlignments[screen.vertical_alignment];
            div.style.setProperty('--vertical-alignment', alignment);
            continue;
        }
        return;
    }

    static calculate_widths(rows, segments) {
        var character_width = 0;
        var text_length;
        for (var row of rows) {
            row.pixel_width = 0;
            character_width = GetFontParameters.get_width(row.font_size, row.font_weight);
            for (var segment of segments) {
                text_length = segment.text === null ? 0 : segment.text.length;
                segment.pixel_width = text_length * (character_width + 1);
                if (segment.row_id == row.row_id) {
                    row.pixel_width += segment.pixel_width;
                }
            }
        }
        return;
    } 

    static set_overflown_flags(rows) {
        for (var row of rows) {
            row.overflown = row.pixel_width > this.data.dimensions.width || row.hasOwnProperty('extends_row');
        }
    }

    static override_horizontal_alignments(rows, width) {
        for (var row of rows) {
            const current = row.horizontal_alignment;
            row.horizontal_alignment = (row.in_mode == "scroll" && row.pixel_width > width) ? "left" : current;
        }
        return;
    }

    static generate_key_frames(screen_cycle, full_cycle, hold_time, screens) {
        let style = document.createElement('style');
        const name = "cycle_screens";
        var on_interval = screen_cycle;
        let key_frames = KeyFrameGenerator.go(name, on_interval, full_cycle);
        style.textContent += key_frames;
        for (let [file_id, screen] of screens) {
            for (let [group_id, group] of screen) {
                if (group_id == "start_time") {
                    continue;
                }
                const is_not_hold = group.get("mode") != "hold";
                const is_not_overflown = !group.get("overflown");
                if (is_not_hold || is_not_overflown) {
                    continue;
                }
                const name = `cycle_${group_id}`;
                var on_interval = screen_cycle / group.get("elements").size;
                key_frames = KeyFrameGenerator.go(name, on_interval, full_cycle);
                style.textContent += key_frames;
            }
        }
        document.head.appendChild(style);
        return;
    }

    static draw_row(row, segments, dimensions) {
        const alignment = CSSHorizontalAlignments[row.horizontal_alignment];
        var height = parseInt(this.data.defaults.line_spacing) 
        height += GetFontParameters.get_height(row.font_size, row.font_weight);
        var element = document.createElement("div");
        element.id = row.row_id;
        element.classList.add("row");
        element.style.setProperty('--horizontal-alignment', alignment);
        element.style.setProperty('--height', `${height}px`);
        if (row.in_mode == "hold") {
            HoldGroupAnimation.animate(row, element);
        }
        const text_box = this.draw_text_box(row, segments, dimensions);
        element.appendChild(text_box);
        return element;
    } 

    static draw_text_box(row, segments, dimensions){
        var all_pages_cycle_time = null;
        const width = row.pixel_width;
        var element = document.createElement("div");
        var segment_index = 0;
        element.classList.add("text_box");
        element.style.setProperty("--width", `${width}px`);
        if (row.in_mode == "scroll") {
            ScrollAnimation.animate(row, element, dimensions);
        }
        for (var segment of segments) {
            if (segment.row_id != row.row_id) {
                continue;
            }
            element.append(this.draw_segment_box(row, segment));
            segment_index++;
        }
        return element;
    }

    static draw_segment_box(row, segment){
        const height = GetFontParameters.get_height(row.font_size, row.font_weight);
        const width = segment.pixel_width;
        const flash = segment.flash;
        var element = document.createElement('p');
        element.classList.add("segment_box");
        if (flash == "on") {
            element.classList.add("flash");
        }
        element.style.setProperty('--height', `${height}px`);
        element.style.setProperty('--width', `${width}px`);
        if (segment.text === null) {
            return element;
        }
        if (segment.hasOwnProperty("extends_row")) {
            
        }
        for (var character of [...segment.text]) {
            element.appendChild(this.draw_image(row, segment, character));
        }
        return element;
    } 

    static draw_image(row, segment, character) {
        if (!this.CODES.hasOwnProperty(character)) {
            character = "?";
        }     
        const character_as_hex = this.CODES[character];
        const size = row.font_size;
        const weight = row.font_weight;
        const color = segment.foreground_color;
        const background_color = segment.background_color;
        const height = GetFontParameters.get_height(size, weight);
        const width = GetFontParameters.get_width(size, weight);
        const encoded_character = this.data.library[weight][size][color][character_as_hex];
        var image = document.createElement("img");
        image.classList.add("character");
        image.src = 'data:image/png;base64,' + encoded_character;
        image.style.setProperty("--margin-right", "1px");
        image.style.setProperty("--margin-bottom", "1px");
        image.style.setProperty('--background-color', segment.background_color);
        image.style.setProperty("--height", `${height}px`);
        image.style.setProperty("--width", `${width}px`);
        return image;
    }

}


class KeyFrameGenerator {

    static go(name, on_interval, full_cycle) {
        let key_frames = `@keyframes ${name} {\n`;
        const on_start = "0.000%";
        var on_stop = on_interval / full_cycle * 100;
        on_stop = on_stop.toFixed(3);
        const off_start = `${on_stop}%`;
        const off_stop = "100.000%";
        on_stop = on_stop - 0.001;
        on_stop = on_stop.toFixed(3);
        on_stop = `${on_stop}%`;
        key_frames += `\t${on_start}, ${on_stop} {\n`;
        key_frames += "\t\tvisibility: visible;\n";
        key_frames += "\t\theight: var(--height);\n";
        key_frames += "\t}\n";
        key_frames += `\t${off_start}, ${off_stop} {\n`;
        key_frames += "\t\tvisibility: hidden;\n";
        key_frames += "\t\theight: 0px;\n"
        key_frames += "\t}\n";
        key_frames += "}\n";
        return key_frames;
    }
    
}


class InterfaceNowPlaying {
    
    static defaults;
    static row_formatting;
    static screen_formatting;
    static segment_formatting;

    constructor(data, file_id) {
        this.defaults = data.defaults;
        this.row_formatting = this.get_rows(data, file_id);
        this.screen_formatting = this.get_screen(data, file_id);
        this.segment_formatting = this.get_segments(data, file_id);
        return;
    }

    get_rows(data, file_id) {
        var a = [];
        const rows = data.row_formatting;
        const rows_length = rows.length;
        for (var i=0; i<rows_length; i++) {
            if (rows[i].file_id != file_id){
                continue
            }
            a.push(rows[i]);
        }
        return a;
    }

    get_screen(data, file_id) {
        var a = [];
        const screens = data.screen_formatting;
        const screens_length = screens.length;
        for (var i=0; i<screens_length; i++) {
            if (screens[i].file_id != file_id){
                continue
            }
            a.push(screens[i]);
        }
        return a;
    }

    get_segments(data, file_id) {
        var a = [];
        const segments = data.segment_formatting;
        const segments_length = segments.length;
        for (var i=0; i<segments_length; i++) {
            if (segments[i].file_id != file_id){
                continue
            }
            a.push(segments[i]);
        }
        return a;

    }

}


class Intervals {

    static data;
    static rows;
    static mapped;

    static go (data) {
        this.data = data;
        this.rows = this.make_rows();
        this.mapped = this.map();
        for (var segment of this.data.segment_formatting) {
            const file_id = segment.file_id;
            const row_id = segment.row_id;
            const row = this.rows[row_id];
            this.mapped[file_id][row_id]['row_pixel_width'] += this.calculate_width(row, segment);
            this.mapped[file_id][row_id]['overflown'] = this.row_overflown_state(segment);
        }
        // this.row_cycle_times();
        // this.screen_cycle_times();
        // this.apply();
        return data;
    }

    static make_rows() {
        var rows = new Map();
        for (var row of this.data.row_formatting) {
            rows[row.row_id] = row;
        }
        return rows;
    }

    static map() {
        var map = new Map();
        for (var file of this.data.playlist) {
            map[file.file_id] = new Map();
        }
        for (var row of this.data.row_formatting) {
            map[row.file_id][row.row_id] = new Map(); 
        }
        for (var segment of this.data.segment_formatting) {
            map[segment.file_id]['screen_cycle_time'] = null;
            map[segment.file_id][segment.row_id]['row_cycle_time'] = null;
            map[segment.file_id][segment.row_id]['row_pixel_width'] = null;
            map[segment.file_id][segment.row_id]['overflown'] = null;
        }
        return map;
    }

    static calculate_width(row, segment) {
        return Segments.calculate_width(row, segment);
    }

    static row_overflown_state(segment) {
        const file_id = segment.file_id;
        const row_id = segment.row_id;
        const width = this.mapped[file_id][row_id]['row_pixel_width'];
        return width >= this.data.dimensions.width;
    }

    static screens() {
        return;
    }

    static apply() {
        return;
    }

}


class Segments {

    static get_segment_from_array(segments, target_id) {
        for (var segment of segments) {
            if (segment.segment_id == target_id) {
                break;
            }
        }
        return segment;
    }

    static get_segment_from_list(segments, target_id) {
        var segment = segments.head;
        while (segment.data.segment_id != target_id && segment != null) {
            segment = segment.next;
        }
        return segment;
    }

    static calculate_width(row, segment) {
        const character_width = GetFontParameters.get_width(row.font_size, row.font_weight);
        const text = segment.text == null ? "" : segment.text;
        const length = text.length
        const line_width = length * (character_width + 1)
        return line_width;
    }

    static decrement_row_id(segment, amount) {
        var number = Segments.get_row_number(segment);
        number -= amount;
        return number;
    }

    static get_row_number(segment) {
        var row_number = segment.row_id.slice(-3);
        row_number = parseInt(row_number);
        return row_number;
    }

    static change_file_part_of_segment(segment, new_file) {
        const f = new_file;
        const r = segment.row_id.slice(-3);
        const s = segment.segment_id.slice(-3);
        segment.file_id = f;
        segment.row_id = `${f}${r}`;
        segment.segment_id = `${f}${r}${s}`;
        return;
    }

    static change_row_part_of_segment(segment, new_row) {
        const f = segment.file_id;
        const r = String(parseInt(new_row)).padStart(3, "0");
        const s = segment.segment_id.slice(-3);
        segment.row_id = `${f}${r}`;
        segment.segment_id = `${f}${r}${s}`;
        return;
    }

    static decrement_segment_id(segment, amount) {
        var number = parseInt(segment.number);
        number -= amount;
        const l = segment.segment_id.slice(0,-3);
        const r = String(number).padStart(3, "0");
        const new_id = `${l}${r}`;
        return new_id;
    }

}


class Rows {

    static get_row_from_array(rows, target_id) {
        for (var row of rows) {
            if (row.row_id == target_id) {
                break;
            }
        }
        return row;
    }

    static get_row_from_list(rows, target_id) {
        var row = rows.head;
        while (row.data.row_id != target_id && row != null) {
            row = row.next;
        }
        return row;
    }

    static create_map(rows) {
        var map_ = new Map();
        for (var row of rows) {
            map_.set(row.row_id, null);
        }
        return map_;
    }

    static get_hold_group_count(rows, extends_row_id) {
        var count = 0;
        for (var row of rows) {
            if (!row.hasOwnProperty('extends_row')) {
                continue;
            }
            if (row.extends_row == extends_row_id) {
                count ++;
            }
        }
        return count;
    }

}


class Screens {

    static get_screen_from_array(screens, target_id) {
        for (var screen of screens) {
            if (screen.file_id == target_id) {
                break;
            }
        }
        return screen;
    }

    static make_screen_map(screens) {
        var map_ = new Map();
        for (var screen of screens) {
            map_.set(screen.file_id, null);
        }
        return map_;
    }

    static calculate_used_screen_height(screen, rows) {
        var row = rows.head;
        var height = 0;
        while (row != null) {
            if (row.data.file_id != screen.data.file_id) {
                row = row.next;
                continue;
            }
            if (row.data.hasOwnProperty('extends_row') && row.data.row_id != row.data.extends_row) {
                row = row.next;
                continue;
            }
            const character_height = GetFontParameters.get_height(row.data.font_size, row.data.font_weight); 
            height += character_height;
            row = row.next;
            continue;
        }
        return height;
    }    

}


class AnimationParameters {

    static full_cycle;
    static screen_cycle;
    static screens;

    static generate(data) {
        this.screens = AnimateScreens.generate_map_first_pass(data.playlist);
        this.generate_rows_first_pass(
            data.row_formatting, 
            this.screens, 
            data.dimensions, 
            data.defaults
        );
        this.screen_cycle = AnimateScreens.get_screen_cycle(this.screens);
        HoldGroupAnimation.calculate_group_intervals(this.screens, data.defaults.hold_time);
        HoldGroupAnimation.calculate_element_intervals(
            this.screens, 
            AnimationParameters.screen_cycle
        );
        this.full_cycle = this.screens.size * this.screen_cycle;
        AnimateScreens.set_start_times(this.screens, this.screen_cycle);
        HoldGroupAnimation.set_element_start_times(this.screens, data.defaults.hold_time);
        return;
    }

    static generate_rows_first_pass(rows, screen_map, dimensions, defaults) {
        for (var row of rows) {
            const add_mode = this.determine_add_row_mode (row, screen_map);
            switch (add_mode) {
                case "skip":
                    break;
                case "no_overflow":
                    this.add_non_overflown_row(row, screen_map);
                    break;
                case "scroll":
                    ScrollAnimation.add_scroll_row(row, screen_map, dimensions, defaults);
                    break;
                case "hold_group_primary":
                    HoldGroupAnimation.add_hold_group_primary(row, screen_map);
                    break;
                case "hold_group_secondary":
                    HoldGroupAnimation.add_hold_group_secondary(row, screen_map);
                    break;
            }
            continue;
        }
        return;
    }

    static determine_add_row_mode(row, screen_map) {
        if (!screen_map.has(row.file_id)) {
            return "skip";
        }
        if (!row.overflown) {
            return "no_overflow";
        }
        if (row.in_mode == "scroll") {
            return "scroll";
        }
        if (row.hasOwnProperty("extends_row") && row.row_id == row.extends_row) {
            return "hold_group_primary";
        }
        if (row.hasOwnProperty("extends_row") && row.row_id != row.extends_row) {
            return "hold_group_secondary";
        }
        return null;
    }

    static add_non_overflown_row(row, screen_map) {        
        let row_map = new Map();
        row_map.set("mode", row.in_mode);
        row_map.set("overflown", row.overflown);
        row_map.set("interval", row.hold_time);
        let screen = screen_map.get(row.file_id);
        screen.set(row.row_id, row_map);
        return;
    }

}


class AnimateScreens {

    static generate_map_first_pass(playlist) {
        /*
            screen_id: {
                start_time: time in seconds
            }
        */
        let screens_map = new Map();
        for (var screen of playlist) {
            let screen_map = new Map();
            // start_time calculated after row map assembled
            // times calculated by by AnimateScreens.set_start_times() 
            screens_map.set(screen.file_id, new Map());
        }
        return screens_map;
    }

    static get_screen_cycle(screens) {
        var longest = 0;
        for (let [screen_id, screen] of screens){
            for (let [row_id, row] of screen) {
                const interval = row.get("interval");
                longest = interval > longest ? interval : longest
            }
        }
        return longest;
    }

    static set_start_times(screens, cycle) {
        var index = 0; 
        for (let [id, screen] of screens) {
            screen.set("start_time", index * cycle);
            index ++;
        }
        return;
    }    

    static animate() {
        const full_cycle = AnimationParameters.full_cycle;
        for (let [screen_id, screen] of AnimationParameters.screens) {
            const start_time = screen.get("start_time"); 
            let screen_ = document.getElementById(screen_id);
            screen_.style.animation = `cycle_screens ${full_cycle}s linear ${start_time}s infinite`;
        }
        return;
    }

}


class ScrollAnimation {
    
    static scroll_padding = 30;

    static add_scroll_row(row, screens_map, dimensions, defaults) {
        let row_map = new Map();
        row_map.set("mode", row.in_mode);
        row_map.set("overflown", row.overflown);
        const scroll_interval = ScrollAnimation.calculate_scroll_interval(row, dimensions);
        const interval = row.overflown ? scroll_interval : defaults.hold_time; 
        row_map.set("interval", interval);
        let screen = screens_map.get(row.file_id);
        screen.set(row.row_id, row_map);
        return;
    }

    static calculate_scroll_interval(row, dimensions) {
        if (!row.overflown) {
            return null;
        }
        const pixels_per_second = {
            "fastest": 50,
            "fast": 40,
            "normal": 30,
            "slow": 20,
            "slowest": 10
        };
        const font_width = GetFontParameters.get_width(row.font_size, row.font_weight);
        const speed = row.scroll_speed;
        var width = row.pixel_width;
        width += parseInt(dimensions.width);
        width += this.scroll_padding;
        var interval = width / pixels_per_second[speed];
        interval = Math.round(interval);
        return interval;
    }

    static animate(row, element, dimensions) {
        if (!row.overflown) {
            return;
        }
        const interval = AnimationParameters.screens.get(row.file_id).get(row.row_id).get("interval");
        const start = parseInt(dimensions.width) + this.scroll_padding;
        const stop = row.pixel_width;
        element.classList.add("scroll");
        element.style.setProperty('--scroll-speed', `${interval}s`);
        element.style.setProperty('--start', `${start}px`);
        element.style.setProperty('--stop', `-${stop}px`);
        return;
    }

}


class HoldGroupAnimation {

    static add_hold_group_primary(row, screen_map) {
        /* 
            extends_row_id: {
                mode: "hold",
                interval: hold_element_count * hold_time,
                elements: {
                    row_id: {
                            interval: hold_time,
                            start_time: page_index * screen_cycle + hold_element_index * hold_time
                        }
                }
            }
        */
        let row_map = new Map();
        row_map.set("mode", row.in_mode);
        row_map.set("overflown", row.overflown);
        // interval added in HoldGroupAnimation.calculate_group_intervals()
        let elements = new Map();
        let element = new Map();
        element.set("interval", row.hold_time);  // may be overwritten in HoldGroupAnimation.calculate_element_intervals()
        elements.set(row.row_id, element);
        row_map.set("elements", elements);
        let screen = screen_map.get(row.file_id);
        screen.set(row.row_id, row_map);
        return;
    }

    static add_hold_group_secondary(row, screen_map) {
        /* 
            extends_row_id: {
                mode: "hold",
                interval: hold_element_count * hold_time,
                elements: {
                    --->row_id: {
                        --->interval: hold_time,
                        --->start_time: page_index * screen_cycle + hold_element_index * hold_time
                    --->}
                }
            }
        */
        let elements = screen_map.get(row.file_id).get(row.extends_row).get("elements");
        let element = new Map();
        element.set("interval", row.hold_time);  // may be overwritten in HoldGroupAnimation.calculate_element_intervals()
        // start_time added in HoldGroupAnimation.set_start_times()
        elements.set(row.row_id, element);
        return
    }

    static calculate_group_intervals (screen_map, hold_time) {
        for (let [screen_id, screen] of screen_map) {
            for (let [group_id, group] of screen) {
                const mode = group.get("mode");
                const overflown = group.get("overflown");
                if (mode != "hold"  || !overflown) {
                    continue;
                }
                const elements = group.get("elements");
                var interval = 0;
                for (let [element_id, element] of elements) {
                    interval += element.get("interval");
                } 
                group.set("interval", interval);
            }
        }
        return;
    }

    static calculate_element_intervals (screen_map, screen_cycle) {
        for (let [screen_id, screen] of screen_map) {
            for (let [group_id, group] of screen) {
                const is_not_hold = group.get("mode") != "hold";
                const is_not_overflown = !group.get("overflown");
                if (is_not_hold || is_not_overflown) {
                    continue;
                }
                const interval = screen_cycle / group.get("elements").size;
                for (let [element_id, element] of group.get("elements")) {
                    element.set("interval", interval);
                }
            }
        }
       // 
    }

    static set_element_start_times(screens, hold_time) {
        for (let [screen_id, screen]  of screens) {
            const screen_start = parseInt(screen.get("start_time"));
            var element_offset = 0;
            for (let [group_id, group] of screen) {
                if (group_id == "start_time") {
                    continue;
                }
                const is_not_hold = group.get("mode") != "hold";
                const is_not_overflown = !group.get("overflown");
                if (is_not_hold || is_not_overflown) {
                    continue;
                }
                for (let [element_id, element] of group.get("elements")) {
                    const start_time = screen_start + element_offset;
                    element_offset += parseInt(element.get("interval"));
                    element.set("start_time", start_time);
                }
            }
        }
        return;
    }

    static animate(row, element) {
        if (!row.overflown) {
            return;
        }
        const id = row.extends_row;
        const full_cycle = AnimationParameters.full_cycle;
        const screen_map = AnimationParameters.screens.get(row.file_id);
        const element_map = screen_map.get(row.extends_row).get("elements").get(row.row_id);
        const start_time = element_map.get("start_time");
        element.style.animation = `cycle_${id} ${full_cycle}s linear ${start_time}s infinite`;
        element.style.visibility = 'hidden';
        return;
    }

}


class Playlist {

    static create_map(playlist) {
        var map_ = new Map();
        for (var element of playlist) {
            map_.set(element.file_id, null);
        }
        return map_;
    }

}


class Node {

    constructor(data, next) {
        this.data = data;
        this.next = next;
        return;
    }

    extract_clone() {
        return new Node(AppTools.clone(this.data), null);
    }

    insert_after_me(node) {
        node.next = this.next;
        this.next = node;
        return;
    }

}


class LinkedList {

    constructor(data) {
        if (data === null || data === undefined) {
            this.head = null;
            this.tail = null;
            return;
        }
        if (Array.isArray(data)) {
            this.from_array(data);
            return;
        }
        this.head = new Node(data, this.head);
        return;
    }

    insert_head(data) {
        this.head = new Node(data, this.head);
        return;
    }

    insert_tail(data) {
        const new_node = new Node(data, null);
        if(this.head === null) {
            this.head = new_node;
            this.tail = new_node;
            return;
        }
        this.tail.next = new_node;
        this.tail = new_node;
        return;
    }

    insert_after(target_data, data) {
        var node = this.head;
        while (node.data != target_data) {
            if (node.next === null) {
                return;
            }
            node = node.next;
        }
        node.next = new Node(data, node.next);
        return;
    }

    get_node(target_data) {
        var node= this.head;
        while(node.data != target_data) {
            if (node.next === null) {
                return null;
            }
            node = node.next;
        }
        return node;
    }

    to_array() {
        var a = []
        var node = this.head;
        while (node != null) {
            a.push(node.data);
            node = node.next;
        }
        return a;
    }

    from_array(a) {
        this.head = null;
        for (var i=0; i<a.length; i++) {
            this.insert_tail(a[i]);
        }
        return;
    }

}


class AppTools {

    static draw_sign() {       
        const formatting = { 
            year: 'numeric', 
            month: 'numeric', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        };
        const now = new Date(Date.now());
        const formatted = now.toISOString('en-US', formatting).replace("T", " ").replace("Z", "");
        GetData.go();
        setTimeout(()=>this.draw_sign(), 200);
        console.log(`${formatted} -- Ellapsed Time ${Date.now() - GetData.start_time} ms`);
    }

    static clone(x) {
        return JSON.parse(JSON.stringify(x));
    }

    static get_text_segments(data) {
        var segments = data.segment_formatting;
        var selected = new LinkedList();
        for (var i=0; i<segments.length; i++) {
            var this_file_id = segments[i].file_id;
            if (!this.is_string_segment(this_file_id)){
                selected.insert_tail(segments[i]);
            }
        }
        return selected;
    }

    static get_string_segments(data) {
        var segments = data.segment_formatting;
        var selected = [];
        for (var i=0; i<segments.length; i++) {
            var this_file_id = segments[i].file_id;
            if (this.is_string_segment(this_file_id)){
                selected.push(segments[i])
            }
        }
        return selected;
    }

    static is_string_segment(file_id) {
        const checker = file_id.substr(6,1);
        return checker == "S";
    }

    static file_id_in_playlist(file_id, playlist) {
        var node = playlist.head;
        while (node !== null) {
            if (node.data.file_id == file_id) {
                return true;
            }
            node = node.next;
        }
        return false;
    }

    static clean_id(id) {
        return id.replace(/[a-z]/g, '');
    }

}