import React, { useState, useEffect } from 'react';

const treeData = {
  "Math and Informatics": {
    "Computer Science": {
      "Artificial Intelligence and Software Engineering": {
        commonSubjects: ["Distributed Systems"],
        specialtySubjects: ["Algorithmics and Real-Time Systems"]
      },
      "Artificial Intelligence and Image Processing": {
        commonSubjects: ["Distributed Systems"],
        specialtySubjects: ["Machine Learning"]
      },
      "Intelligent Systems and Machine Learning": {
        commonSubjects: ["Distributed Systems"],
        specialtySubjects: ["Algorithmics and Complexity"]
      }
    },
    "Mathematics": {
        "Mathematical Analysis": {
          commonSubjects: ["Vector Spaces"],
          specialtySubjects: ["Numerical Methods"]
        }
      },
      "Applied Mathematics": {
        "Mathematical Analysis and Applications": {
          commonSubjects: ["Banach and Hilbert Spaces"],
          specialtySubjects: ["Fourier Analysis and Wavelets"]
        },
        "Modeling, Control, and Optimization": {
          commonSubjects: ["Banach and Hilbert Spaces"],
          specialtySubjects: ["Brownian Motion and Stochastic Calculus"]
        },
        "Probability-Statistics and Applications": {
          commonSubjects: ["Banach and Hilbert Spaces"],
          specialtySubjects: ["Nonparametric Statistics"]
        }
      },
  },
  "LLE (English Language)": {
    "English Language": {
      "Applied Linguistics": {
        commonSubjects: ["Research Methodology"],
        specialtySubjects: ["Applied Linguistics"]
      },
      "Teaching English as a Foreign Language": {
        commonSubjects: ["Research Methodology"],
        specialtySubjects: ["Learning Theories and Syllabus Design"]
      },
      "Language of Specialization, Culture, and Business": {
        commonSubjects: ["Research Methodology"],
        specialtySubjects: ["English for Specific Purposes (ESP)"]
      },
      "Cultural Studies": {
        commonSubjects: ["Research Methodology"],
        specialtySubjects: ["Literature and Civilization"]
      }
    }
  },
  "SEGC (Financial Sciences and Accounting)": {
    "Accounting and Finance": {
      commonSubjects: ["In-Depth Financial Analysis"],
      specialtySubjects: ["In-Depth Financial Accounting"]
    }
  },
  "SNV (Biological Sciences)": {
    "Applied Microbiology": {
      commonSubjects: ["Biological Analysis Techniques"],
      specialtySubjects: ["Microbial Interactions"]
    },
    "Biodiversity and Valorization of Natural Resources": {
      commonSubjects: ["Biological Analysis Techniques"],
      specialtySubjects: ["Phytochemistry and Valorization of Biomolecules"]
    }
  },
  "ST (Technology and Sciences)": {
    "Civil Engineering": {
      "Materials in Civil Engineering": {
        commonSubjects: ["RDM 1 and RDM 2"],
        specialtySubjects: ["Mineral Binders, Special Construction Materials, Durability of Materials"]
      }
    },

    "Mechanical Engineering": {
      "Energy": {
        commonSubjects: ["Numerical Methods"],
        specialtySubjects: ["Fluid Mechanics and Heat Transfer"]
      },
      "Mechanical Engineering and Materials": {
        commonSubjects: ["Numerical Methods"],
        specialtySubjects: ["Finite Element Methods and Composite Materials"]
      }
    },
    "Metallurgy": {
      "Metallurgical Engineering": {
        commonSubjects: ["Physical Metallurgy 1"],
        specialtySubjects: ["Phase Transformations"]
      }
    },
    "Electrical Engineering": {
      "Electrical Control": {
        commonSubjects: ["Advanced Power Electronics"],
        specialtySubjects: ["Advanced Electrical Machines"]
      }
    },
    "Process Engineering": {
      "Chemical Engineering": {
        commonSubjects: ["Chemical Thermodynamics"],
        specialtySubjects: ["Unit Operations"]
      },
      "Environmental Process Engineering": {
        commonSubjects: ["Chemical Thermodynamics"],
        specialtySubjects: ["Management and Treatment of Water, Sludge, and Waste"]
      }
    },
  },

  "SHS (Psychology)": {
    "Psychology": {
      "Work and Organizational Psychology": {
        commonSubjects: ["Scientific Research Methodology"],
        specialtySubjects: ["Organizational Behavior"]
      }
    }
  },
  "DSP (Law)": {
    "Law": {
      "قانون الاسرة": {
        commonSubjects: ["مدخل للعلوم القانونية"],
        specialtySubjects: ["قضايا أسرية"]
      },
      "قانون الاعمال": {
        commonSubjects: ["مدخل للعلوم القانونية"],
        specialtySubjects: ["قانون المنافسة و الممارسات التجارية"]
      },
      "قانون مدني": {
        commonSubjects: ["مدخل للعلوم القانونية"],
        specialtySubjects: ["تطبيقات الدعوى الادارية"]
      },
      "قانون دولي": {
        commonSubjects: ["مدخل للعلوم القانونية"],
        specialtySubjects: ["المسؤولية الدولية"]
      },
      "قانون اداري": {
        commonSubjects: ["مدخل للعلوم القانونية"],
        specialtySubjects: ["قانون حماية المستهلك"]
      }
    }
  }
};

const CascadingSelects = ({ onChange }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSubjectType, setSelectedSubjectType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    onChange?.({
      branch: selectedBranch,
      department: selectedDepartment,
      specialty: selectedSpecialty,
      subjectType: selectedSubjectType,
      subject: selectedSubject
    });
  }, [selectedBranch, selectedDepartment, selectedSpecialty, selectedSubjectType, selectedSubject, onChange]);

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedDepartment('');
    setSelectedSpecialty('');
    setSelectedSubjectType('');
    setSelectedSubject('');
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedSpecialty('');
    setSelectedSubjectType('');
    setSelectedSubject('');
  };

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
    setSelectedSubjectType('');
    setSelectedSubject('');
  };

  const handleSubjectTypeChange = (e) => {
    setSelectedSubjectType(e.target.value);
    setSelectedSubject('');
  };

  const getDepartments = () => {
    return selectedBranch ? Object.keys(treeData[selectedBranch]) : [];
  };

  const getSpecialties = () => {
    if (!selectedBranch || !selectedDepartment) return [];
    const dept = treeData[selectedBranch][selectedDepartment];
    return dept.commonSubjects ? [] : Object.keys(dept);
  };

  const getSubjects = () => {
    if (!selectedBranch || !selectedDepartment) return { common: [], specialty: [] };
    
    const dept = treeData[selectedBranch][selectedDepartment];
    if (dept.commonSubjects) {
      return {
        common: dept.commonSubjects,
        specialty: dept.specialtySubjects
      };
    }
    
    if (selectedSpecialty) {
      return {
        common: dept[selectedSpecialty].commonSubjects,
        specialty: dept[selectedSpecialty].specialtySubjects
      };
    }
    
    return { common: [], specialty: [] };
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Branch</label>
        <select
          value={selectedBranch}
          onChange={handleBranchChange}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Branch</option>
          {Object.keys(treeData).map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {selectedBranch && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Sector</label>
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Sector</option>
            {getDepartments().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      )}

      {selectedDepartment && getSpecialties().length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialty</label>
          <select
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Specialty</option>
            {getSpecialties().map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      )}

      {((selectedDepartment && getSubjects().common.length > 0) || 
        (selectedSpecialty && getSubjects().common.length > 0)) && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Type (Common or Speciality)</label>
          <select
            value={selectedSubjectType}
            onChange={handleSubjectTypeChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Subject Type (Common or Speciality)</option>
            <option value="common">Common Subjects</option>
            <option value="specialty">Specialty Subjects</option>
          </select>
        </div>
      )}

      {selectedSubjectType && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {getSubjects()[selectedSubjectType].map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CascadingSelects;