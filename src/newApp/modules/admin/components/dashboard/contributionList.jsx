import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialogue';
import {FileText, Mail,Phone, Book, Download, ExternalLink, ChevronRight, ChevronDown, User } from 'lucide-react';
import { CascadeTree } from 'rsuite';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import { BASE_URL } from '../../../../../config';
import newRequest from '../../../../../utils/newRequest';





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


// Transform function remains the same
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



const ContributorCard = ({ contributor, onToggle, isExpanded, onFileClick }) => {
  return (
    <div className="space-y-2">
      <Card 
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <User className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{contributor.name}</div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  <span className="truncate">{contributor.email}</span>
                </span>
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  <span className="truncate">{contributor.PhoneNumber}</span>
                </span>
                <span className="flex items-center">
                  <Book className="w-3 h-3 mr-1" />
                  <span>Documents: {contributor.contributions.length}</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isExpanded && (
        <div className="ml-8 space-y-2">
          {contributor.contributions.map(file => (
            <Card 
              key={file.id} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onFileClick({
                ...file,
                author: contributor.name,
                email: contributor.email,
                branch: contributor.branch,
                department: contributor.department
              })}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const FileList = ({ data, loading, onFileClick }) => {
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  const toggleUser = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!data || !data.contributions || data.contributions.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center text-gray-500 text-sm">
          No documents found for this subject
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.contributions.map(contributor => (
        <ContributorCard
          key={contributor.userId}
          contributor={contributor}
          isExpanded={expandedUsers.has(contributor.userId)}
          onToggle={() => toggleUser(contributor.userId)}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
};

const FileDetails = ({ file, onClose, onView }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(file.cloudinaryUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name; // Use the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  return (
    <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>File Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Document Information</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Name:</span> {file.name}</p>
            <p><span className="font-medium">Author:</span> {file.author}</p>
            <p><span className="font-medium">Email:</span> {file.email}</p>
            <p><span className="font-medium">Branch:</span> {file.branch}</p>
            <p><span className="font-medium">Upload Date:</span> {new Date(file.createdAt).toLocaleDateString()}</p>
            <p className="font-semibold text-green-600">Author Note:</p>
              <div className="border border-green-600 p-2 rounded">
                <p>{file.note ? file.note : "No Notes."}</p>
              </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onView} className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};


const ContributionList = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedNode && (!selectedNode.type && selectedNode.children)) {
      setSelectedFiles(null);
      setSelectedFile(null);
    }
  }, [selectedNode]);

  const api = {
    getFiles: async (path) => {
      try {
        setError(null);
        const response = await newRequest.get(
          `${BASE_URL}admin/contributions?path=${encodeURIComponent(path)}`
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching files:', error);
        setError(error.response?.data?.message || 'Failed to fetch files');
        throw error;
      }
    },

    downloadFile: async (fileId) => {
      try {
        const response = await newRequest.get(
          `${BASE_URL}admin/contributions/download/${fileId}`,
          { 
            responseType: 'blob',
            headers: {
              'Accept': 'application/octet-stream'
            }
          }
        );
        
        // Get filename from Content-Disposition header or use fallback
        const contentDisposition = response.headers['content-disposition'];
        let filename = `file-${fileId}`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        setError(error.response?.data?.message || 'Failed to download file');
      }
    }
  };
  const handleNodeSelect = async (node) => {
    setSelectedNode(node);
    setError(null);
    
    if (!node.type && node.children) {
      setSelectedFiles(null);
      setSelectedFile(null);
      return;
    }

    if (!node.children || node.type) {
      try {
        setLoading(true);
        const data = await api.getFiles(node.value);
        setSelectedFiles(data);
      } catch (error) {
        console.error('Error:', error);
        setSelectedFiles(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">Document Categories</h2>
          <CascadeTree
            data={transformTreeData(treeData)}
            columnWidth={200}
            height={600}
            renderTreeNode={(label, item) => (
              <>
                {item.children && !item.type ? <FolderFillIcon /> : <FolderFillIcon />} {label}
              </>
            )}
            onSelect={handleNodeSelect}
          />
        </div>
      </div>

      <div className="col-span-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">
            {selectedNode ? (
              `Files in ${selectedNode.label}`
            ) : (
              'Select a category to view files'
            )}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}
          <FileList
            data={selectedFiles}
            loading={loading}
            onFileClick={setSelectedFile}
          />
        </div>
      </div>

      {selectedFile && (
        <FileDetails
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={() => api.downloadFile(selectedFile.id)}
          onView={() => window.open(selectedFile.cloudinaryUrl, '_blank')}
        />
      )}
    </div>
  );
};

export default ContributionList;