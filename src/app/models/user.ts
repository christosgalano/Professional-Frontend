export interface User {
    id?: number;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string,
    profilePicture?: string;
    dob?: string;
    phone?: string;
    role?: string;
    roles?: string;
    education?: string;
    educationPrivate?: boolean;
    workExperience?: string;
    workExperiencePrivate?: boolean;
    skills?: string;
    skillsPrivate?: boolean;
    active?: boolean;
    nonLocked?: boolean;
    createdDate?: Date;
}