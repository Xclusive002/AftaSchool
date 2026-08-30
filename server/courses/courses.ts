import { ShortCourse } from '../../src/types';
import { masterProfessionalCourses } from './masterProfessionalCourses';
import { coursesPart1 } from './coursesPart1';
import { coursesPart2 } from './coursesPart2';
import { coursesPart3 } from './coursesPart3';

export const comprehensiveShortCourses: ShortCourse[] = [
  ...masterProfessionalCourses,
  ...coursesPart1,
  ...coursesPart2,
  ...coursesPart3
];

