import { RootState } from '..';
import { createSelector } from '@reduxjs/toolkit';
import IStudentResponse from '@app/types/student/IStudentResponse';

// Get current student from profile data (this is the correct source) - memoized to prevent rerenders
export const currentStudentSelector = createSelector(
  (state: RootState) => state.profile?.currentProfile,
  profileData => {
    const studentProfile = profileData?.studentProfile;

    if (!studentProfile) return null;

    // Map profile student data to IStudentResponse format
    return {
      id: studentProfile.id,
      firstName: studentProfile.firstName,
      lastName: studentProfile.lastName,
      email: profileData?.email || '',
      profilePictureUrl: studentProfile.avatarUrl,
      university: studentProfile.university,
      faculty: studentProfile.faculty,
      specialization: studentProfile.specialization,
      studyYear: studentProfile.studyYear,
      educationLevel: studentProfile.educationLevel,
      bio: studentProfile.bio,
      linkedInUrl: studentProfile.linkedInUrl,
      gitHubUrl: studentProfile.gitHubUrl,
      facebookUrl: studentProfile.facebookUrl,
      interests: studentProfile.interests,
      joinedDate: studentProfile.joinedDate,
      createdAt: studentProfile.createdAt,
      updatedAt: studentProfile.updatedAt,
    };
  },
);

export const studentCurrentStudentSelector = (state: RootState): IStudentResponse | null => state.student.currentStudent;
export const studentStudentsListSelector = (state: RootState): any => state.student.studentsList;
export const studentIsLoadingSelector = (state: RootState): boolean => state.student.loading;
export const studentFullStateSelector = (state: RootState) => state.student;

export const studentsListSelector = (state: RootState) => state.student?.studentsList;
export const studentsSelector = (state: RootState) => state.student?.studentsList?.students || [];
export const studentsTotalCountSelector = (state: RootState): number => state.student?.studentsList?.totalCount || 0;
export const studentsPageSelector = (state: RootState): number => state.student?.studentsList?.page || 1;
export const studentsPageSizeSelector = (state: RootState): number => state.student?.studentsList?.pageSize || 10;
export const studentHasDataSelector = (state: RootState): boolean => !!state.student?.currentStudent;
export const studentsHasListSelector = (state: RootState): boolean => (state.student?.studentsList?.students?.length || 0) > 0;
