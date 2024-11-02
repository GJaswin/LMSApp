export interface Instructor {
    id: number;
    title: string;
}

export interface Course {
    id: number;
    title: string;
    url: string;
    is_paid: boolean;
    price: string;
    visible_instructors: Instructor[]
    image_480x270: string;
    image_125_H: string;
    image_240x135: string;
    image_240x13: string;
    is_practise_test_course: boolean;
    published_title: string;
    tracking_id: string;
    locale: {
        title: string;
        english_title: string;
        simple_english_title: string;
    };
    result: any;
    subtitle: string;
    num_reviews: number;

}

export interface CurriculumItem {
    _class: string;
    id: number;
    title: string;
    description?: string;
    content_summary?: string;
    is_free?: boolean;
    sort_order?: number;
}

export interface User {
    _class: string;
    title: string;
    name: string;
    display_name: string;
}

export interface Review {
    _class: string;
    id: number;
    content: string;
    rating: number;
    created: string;
    modified?: boolean;
    user_modified: string;
    user?: User;
}