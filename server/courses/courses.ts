import { ShortCourse } from '../../src/types';
import { masterProfessionalCourses } from './masterProfessionalCourses.js';
import { coursesPart1 } from './coursesPart1.js';
import { coursesPart2 } from './coursesPart2.js';
import { coursesPart3 } from './coursesPart3.js';

export const comprehensiveShortCourses: ShortCourse[] = [
  ...masterProfessionalCourses,
  ...coursesPart1,
  ...coursesPart2,
  ...coursesPart3
];

