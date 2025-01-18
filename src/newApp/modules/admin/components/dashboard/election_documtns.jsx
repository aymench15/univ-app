import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialogue';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { CascadeTree } from 'rsuite';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import newRequest from '../../../../../utils/newRequest';
import { BASE_URL } from '../../../../../config';

// Using the same tree data structure you provided

const treeData = {
    "Math and Informatics": {
      "Computer Science": {
        "Distributed Systems": {
          commonSubjects:["Distributed Systems"]
        },
        "Artificial Intelligence and Software Engineering": {
          specialtySubjects: ["Algorithmics and Real-Time Systems"]
        },
        "Artificial Intelligence and Image Processing": {
          specialtySubjects: ["Machine Learning"]
        },
        "Intelligent Systems and Machine Learning": {
          specialtySubjects: ["Algorithmics and Complexity"]
        }
      },
      "Mathematics": {
        "Vector Spaces": {
          commonSubjects: ["Vector Spaces"]
        },
        "Mathematical Analysis": {
          specialtySubjects: ["Numerical Methods"]
        }
      },
      "Applied Mathematics": {
        "Banach and Hilbert Spaces": {
          commonSubjects: ["Banach and Hilbert Spaces"]
        },
        "Mathematical Analysis and Applications": {
          specialtySubjects: ["Fourier Analysis and Wavelets"]
        },
        "Modeling, Control, and Optimization": {
          specialtySubjects: ["Brownian Motion and Stochastic Calculus"]
        },
        "Probability-Statistics and Applications": {
          specialtySubjects: ["Nonparametric Statistics"]
        }
      }
    },
    "LLE (English Language)": {
      "English Language": {
        "Research Methodology": {
          commonSubjects: ["Research Methodology"]
        },
        "Applied Linguistics": {
          specialtySubjects: ["Applied Linguistics"]
        },
        "Teaching English as a Foreign Language": {
          specialtySubjects: ["Learning Theories and Syllabus Design"]
        },
        "Language of Specialization, Culture, and Business": {
          specialtySubjects: ["English for Specific Purposes (ESP)"]
        },
        "Cultural Studies": {
          specialtySubjects: ["Literature and Civilization"]
        }
      }
    },
    "SEGC (Financial Sciences and Accounting)": {
      "Accounting and Finance": {
        "In-Depth Financial Analysis": {
          commonSubjects: ["In-Depth Financial Analysis"]
        },
        specialtySubjects: ["In-Depth Financial Accounting"]
      }
    },
    "SNV (Biological Sciences)": {
      "Applied Microbiology": {
        "Biological Analysis Techniques": {
          commonSubjects: ["Biological Analysis Techniques"]
        },
        specialtySubjects: ["Microbial Interactions"]
      },
      "Biodiversity and Valorization of Natural Resources": {
        "Biological Analysis Techniques": {
          commonSubjects: ["Biological Analysis Techniques"]
        },
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
        "Scientific Research Methodology": {
          commonSubjects: ["Scientific Research Methodology"]
        },
        "Work and Organizational Psychology": {
          specialtySubjects: ["Organizational Behavior"]
        }
      }
    },
    "DSP (Law)": {
      "Law": {
        "مدخل للعلوم القانونية": {
          commonSubjects: ["مدخل للعلوم القانونية"]
        },
        "قانون الاسرة": {
          specialtySubjects: ["قضايا أسرية"]
        },
        "قانون الاعمال": {
          specialtySubjects: ["قانون المنافسة و الممارسات التجارية"]
        },
        "قانون مدني": {
          specialtySubjects: ["تطبيقات الدعوى الادارية"]
        },
        "قانون دولي": {
          specialtySubjects: ["المسؤولية الدولية"]
        },
        "قانون اداري": {
          specialtySubjects: ["قانون حماية المستهلك"]
        }
      }
    }
  };
  

const transformTreeData = (data, parentPath = '') => {
  return Object.entries(data).map(([key, value]) => {
    const currentPath = parentPath ? `${parentPath}/${key}` : key;
    
    if (value.commonSubjects || value.specialtySubjects) {
      const subjects = [];
      if (value.commonSubjects) {
        subjects.push(...value.commonSubjects.map(subject => ({
          label: `Common: ${subject}`,
          value: `${currentPath}/common/${subject}`,
          type: 'common'
        })));
      }
      if (value.specialtySubjects) {
        subjects.push(...value.specialtySubjects.map(subject => ({
          label: `Specialty: ${subject}`,
          value: `${currentPath}/specialty/${subject}`,
          type: 'specialty'
        })));
      }
      return {
        label: key,
        value: currentPath,
        children: subjects
      };
    }
    
    return {
      label: key,
      value: currentPath,
      children: transformTreeData(value, currentPath)
    };
  });
};

const RandomFileDisplay = ({ file, loading, error }) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!file) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-gray-500">Select a subject to view a random file</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium">{file.document.name}</h3>
            <div className="text-sm text-gray-500">
              <p>Author: {file.user.name}</p>
              <p>Branch: {file.user.branch}</p>
              <p>Sector: {file.user.department}</p>
              <p>Subject: {file.user.subject}</p>
              <p className="font-semibold text-blue-500">Author Note:</p>
              <div className="border border-blue-500 p-2 rounded">
                <p>{file.document.note ? file.document.note : "No Note."}</p>
              </div>
              <a 
                href={file.document.cloudinaryUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Document
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ElectionTree = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [randomFile, setRandomFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomFile = async (path) => {
    try {
      setLoading(true);
      setError(null);
      const response = await newRequest.get(`${BASE_URL}admin/random-file?path=${encodeURIComponent(path)}`);
     
      setRandomFile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch random file');
      setRandomFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeSelect = async (node) => {
    setSelectedNode(node);
    
    if (node.type) {
      await fetchRandomFile(node.value);
    } else {
      setRandomFile(null);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">Subject Selection</h2>
          <CascadeTree
            data={transformTreeData(treeData)}
            columnWidth={200}
            height={600}
            renderTreeNode={(label, item) => (
              <>
                {item.children && !item.type ? <FolderFillIcon /> : <PageIcon />} {label}
              </>
            )}
            onSelect={handleNodeSelect}
          />
        </div>
      </div>

      <div className="col-span-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">
            {selectedNode ? `Random File from ${selectedNode.label}` : 'Select a subject'}
          </h2>
          <RandomFileDisplay
            file={randomFile}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ElectionTree;