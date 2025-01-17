
// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from '../ui/card';
// import { Button } from '../ui/button';
// import { 
//   Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle 
// } from '../ui/dialogue';
// import { ChevronDown, ChevronUp, FileText, Calendar } from 'lucide-react';
// import newRequest from '../../../../../utils/newRequest';
// import { BASE_URL } from '../../../../../config';
// import EmptyState from './emptyState';

// const ContributionList = () => {
//   const [expandedId, setExpandedId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [contributions, setContributions] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedContribution, setSelectedContribution] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const itemsPerPage = 4;

//   useEffect(() => {
//     fetchContributions(currentPage);
//   }, [currentPage]);

//   const fetchContributions = async (page) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await newRequest.get(
//         `${BASE_URL}admin/contributions?page=${page}&limit=${itemsPerPage}`
//       );
//         setContributions(response.data.contributions);
//       setTotalPages(response.data.totalPages);
   
      
//     } catch (err) {
//       console.error('Error fetching contributions:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpansion = (id) => {
//     setExpandedId((prevId) => (prevId === id ? null : id));
//   };

//   const showContributionDetails = (contribution) => {
//     setSelectedContribution(contribution);
//     const pdfFileUrl = `${contribution.cloudinaryUrl}`;  // Append '.pdf'
//     setPdfUrl(pdfFileUrl); 
//     setShowModal(true);
//   };

//   const renderLoadingState = () => (
//     <Card className="w-full p-8">
//       <div className="flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         <span className="ml-3">Loading contributions...</span>
//       </div>
//     </Card>
//   );

//   const renderErrorState = () => (
//     <Card className="w-full p-8 bg-red-50">
//       <div className="text-red-600 text-center">
//         <h3 className="text-lg font-semibold">Error</h3>
//         <p>{error}</p>
//       </div>
//     </Card>
//   );

//   const renderEmptyState = () => (
//     <Card className="w-full p-8">
//       <div className="text-center">
//         <FileText className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-4 text-lg font-semibold text-gray-900">No Contributions</h3>
//         <p className="mt-2 text-gray-500">
//           No contributions have been made yet. They will appear here once added.
//         </p>
//       </div>
//     </Card>
//   );

//   if (loading) return renderLoadingState();
//   if (error) return renderErrorState();
//   if (!contributions.length) return renderEmptyState();

//   return (
//     <div className="space-y-4">
//       {contributions.map((contribution) => (
//        <Card key={contribution._id} className="w-full" style={{ maxWidth: '1000px', margin: '0 auto' }}>


          
//           <CardHeader 
//             className="cursor-pointer hover:bg-gray-50"
//             onClick={() => toggleExpansion(contribution._id)}
//           >
//             <div className="flex justify-between items-center">
//               <div className="space-y-1">
//                 <h3 className="text-lg font-semibold">{contribution.name}</h3>
//                 <p className="text-gray-600">{contribution.email}</p>
//                 <p className="text-gray-600">{contribution.faculty}</p>
//                 <p className="text-gray-600">{contribution.department}</p>
                
//                 <div className="flex items-center text-sm text-gray-500">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(contribution.lastContribution).toLocaleDateString()}
//                 </div>
//               </div>
//               {expandedId === contribution._id ? (
//                 <ChevronUp className="h-6 w-6" />
//               ) : (
//                 <ChevronDown className="h-6 w-6" />
//               )}
//             </div>
//           </CardHeader>
//           {expandedId === contribution._id && (
//             <CardContent className="pt-4">
//               {contribution.contributions.map((doc) => (
//                 <div
//                   key={doc.id}
//                   className="p-4 mb-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
//                   onClick={() => showContributionDetails(doc)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium">{doc.name}</span>
                    
//                     <span className="text-sm text-gray-500">
//                       {new Date(doc.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           )}
//         </Card>
//       ))}

//       {totalPages > 1 && (
//         <div className="flex justify-center gap-4 mt-6">
//           <Button
//             variant="outline"
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <span className="py-2">
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             variant="outline"
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       )}

//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>{selectedContribution?.name}</DialogTitle>
//           </DialogHeader>
//           <div className="mt-4">
//             <div className="mb-4">
//               <h4 className="font-medium mb-2">Note:</h4>
//               <p className="text-gray-600 whitespace-pre-wrap">
//                 {selectedContribution?.note || 'No note provided'}
//               </p>
//             </div>
//             <div className="mb-4">
//               <h4 className="font-medium mb-2">File Details:</h4>
//               <p className="text-gray-600">
//                 Size: {(selectedContribution?.size / 1024 / 1024).toFixed(2)} MB
//               </p>
//               <p className="text-gray-600">
//                 Uploaded: {new Date(selectedContribution?.createdAt).toLocaleString()}
//               </p>
//             </div>
//             {pdfUrl && (
//               <div className="mt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => window.open(pdfUrl, '_blank')}
//                 >
//                   Download PDF
//                 </Button>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ContributionList;



import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../ui/dialogue';
import { ChevronDown, ChevronUp, FileText, Calendar, Download } from 'lucide-react';
import newRequest from '../../../../../utils/newRequest';
import { BASE_URL } from '../../../../../config';
import EmptyState from './emptyState';

const ContributionList = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contributions, setContributions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchContributions(currentPage);
  }, [currentPage]);

  const fetchContributions = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await newRequest.get(
        `${BASE_URL}admin/contributions?page=${page}&limit=${itemsPerPage}`
      );
      setContributions(response.data.contributions);
      setTotalPages(response.data.totalPages);
      console.log("response: ",response.data)
    } catch (err) {
      console.error('Error fetching contributions:', err);
      setError('Failed to fetch contributions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpansion = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const showContributionDetails = (contribution) => {
    setSelectedContribution(contribution);
    const pdfFileUrl = `${contribution.cloudinaryUrl}`;
    setPdfUrl(pdfFileUrl);
    setShowModal(true);
  };

  const renderLoadingState = () => (
    <Card className="w-full p-8">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3">Loading contributions...</span>
      </div>
    </Card>
  );

  const renderErrorState = () => (
    <Card className="w-full p-8 bg-red-50">
      <div className="text-red-600 text-center">
        <h3 className="text-lg font-semibold">Error</h3>
        <p>{error}</p>
      </div>
    </Card>
  );

  const renderEmptyState = () => (
    <Card className="w-full p-8">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No Contributions</h3>
        <p className="mt-2 text-gray-500">
          No contributions have been made yet. They will appear here once added.
        </p>
      </div>
    </Card>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!contributions.length) return renderEmptyState();

  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <Card key={contribution._id} className="w-full" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <CardHeader
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpansion(contribution._id)}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{contribution.name}</h3>
                <p className="text-gray-600">{contribution.email}</p>
                <p className="text-gray-600">{contribution.branch}</p>
                <p className="text-gray-600">{contribution.department}</p>
                <p className="text-gray-600">{contribution.specialty}</p>
                <p className="text-gray-600">{contribution.subject}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(contribution.lastContribution).toLocaleDateString()}
                </div>
              </div>
              {expandedId === contribution._id ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </div>
          </CardHeader>
          {expandedId === contribution._id && (
            <CardContent className="pt-4">
              {contribution.contributions.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 mb-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => showContributionDetails(doc)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{doc.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedContribution?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="mb-4">
              <h4 className="font-medium mb-2">Note:</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {selectedContribution?.note || 'No note provided'}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">File Details:</h4>
              <p className="text-gray-600">
                Size: {(selectedContribution?.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-gray-600">
                Uploaded: {new Date(selectedContribution?.createdAt).toLocaleString()}
              </p>
            </div>
            {pdfUrl && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContributionList;


// import React, { useState, useEffect } from 'react';
// import CascadingSelects from '../../../../../components/cascade-select/cascade_selection';
// import { Card, CardContent } from '../ui/card';
// import { Button } from '../ui/button';
// import { FileText, User, Calendar } from 'lucide-react';
// import { BASE_URL } from '../../../../../config';

// const ContributionList = () => {
//   const [selections, setSelections] = useState({
//     branch: '',
//     department: '',
//     specialty: '',
//     subjectType: '',
//     subject: ''
//   });
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSelectionChange = (newSelections) => {
//     setSelections(newSelections);
//   };

//   const fetchFilteredDocuments = async () => {
//     try {
//       setLoading(true);
      
//       // Create query parameters based on selections
//       const queryParams = new URLSearchParams();
//       Object.entries(selections).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value);
//       });

//       const response = await fetch(`${BASE_URL}admin/contributions?${queryParams.toString()}`);
//       const data = await response.json();
      
//       if (response.ok) {
//         setDocuments(data);
//       } else {
//         console.error('Failed to fetch documents');
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="p-4 bg-white rounded-lg shadow">
//         <CascadingSelects onChange={handleSelectionChange} />
//         <div className="mt-4">
//           <Button 
//             onClick={fetchFilteredDocuments}
//             disabled={loading || !selections.branch || !selections.department || !selections.subject}
//             className="w-full"
//           >
//             {loading ? 'Loading...' : 'Search Documents'}
//           </Button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {documents.map((doc) => (
//           <Card key={doc._id} className="hover:shadow-lg transition-shadow">
//             <CardContent className="p-4">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <FileText className="w-5 h-5 text-blue-500" />
//                     <h3 className="font-medium">{doc.name}</h3>
//                   </div>
                  
//                   <div className="flex items-center space-x-2 text-sm text-gray-600">
//                     <User className="w-4 h-4" />
//                     <span>{doc.userId.name}</span>
//                   </div>
                  
//                   <div className="flex items-center space-x-2 text-sm text-gray-600">
//                     <Calendar className="w-4 h-4" />
//                     <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
//                   </div>
                  
//                   {doc.note && (
//                     <p className="text-sm text-gray-600">{doc.note}</p>
//                   )}
//                 </div>
                
//                 <a 
//                   href={doc.cloudinaryUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
//                 >
//                   View Document
//                 </a>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
        
//         {documents.length === 0 && !loading && (
//           <div className="text-center py-8 text-gray-500">
//             No documents found matching your criteria
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContributionList;

// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, CardContent } from '../ui/card';
// import { Button } from '../ui/button';
// import { FileText, User, Calendar } from 'lucide-react';
// import { BASE_URL } from '../../../../../config';
// import newRequest from '../../../../../utils/newRequest';

// // Tree data moved outside component to prevent recreating on each render
// const treeData = {
//   "Math and Informatics": {
//     "Computer Science": {
//       "Artificial Intelligence and Software Engineering": {
//         commonSubjects: ["Distributed Systems"],
//         specialtySubjects: ["Algorithmics and Real-Time Systems"]
//       },
//       "Artificial Intelligence and Image Processing": {
//         commonSubjects: ["Distributed Systems"],
//         specialtySubjects: ["Machine Learning"]
//       },
//       "Intelligent Systems and Machine Learning": {
//         commonSubjects: ["Distributed Systems"],
//         specialtySubjects: ["Algorithmics and Complexity"]
//       }
//     },
//     "Mathematics": {
//         "Mathematical Analysis": {
//           commonSubjects: ["Vector Spaces"],
//           specialtySubjects: ["Numerical Methods"]
//         }
//       },
//       "Applied Mathematics": {
//         "Mathematical Analysis and Applications": {
//           commonSubjects: ["Banach and Hilbert Spaces"],
//           specialtySubjects: ["Fourier Analysis and Wavelets"]
//         },
//         "Modeling, Control, and Optimization": {
//           commonSubjects: ["Banach and Hilbert Spaces"],
//           specialtySubjects: ["Brownian Motion and Stochastic Calculus"]
//         },
//         "Probability-Statistics and Applications": {
//           commonSubjects: ["Banach and Hilbert Spaces"],
//           specialtySubjects: ["Nonparametric Statistics"]
//         }
//       },
//   },
//   "LLE (English Language)": {
//     "English Language": {
//       "Applied Linguistics": {
//         commonSubjects: ["Research Methodology"],
//         specialtySubjects: ["Applied Linguistics"]
//       },
//       "Teaching English as a Foreign Language": {
//         commonSubjects: ["Research Methodology"],
//         specialtySubjects: ["Learning Theories and Syllabus Design"]
//       },
//       "Language of Specialization, Culture, and Business": {
//         commonSubjects: ["Research Methodology"],
//         specialtySubjects: ["English for Specific Purposes (ESP)"]
//       },
//       "Cultural Studies": {
//         commonSubjects: ["Research Methodology"],
//         specialtySubjects: ["Literature and Civilization"]
//       }
//     }
//   },
//   "SEGC (Financial Sciences and Accounting)": {
//     "Accounting and Finance": {
//       commonSubjects: ["In-Depth Financial Analysis"],
//       specialtySubjects: ["In-Depth Financial Accounting"]
//     }
//   },
//   "SNV (Biological Sciences)": {
//     "Applied Microbiology": {
//       commonSubjects: ["Biological Analysis Techniques"],
//       specialtySubjects: ["Microbial Interactions"]
//     },
//     "Biodiversity and Valorization of Natural Resources": {
//       commonSubjects: ["Biological Analysis Techniques"],
//       specialtySubjects: ["Phytochemistry and Valorization of Biomolecules"]
//     }
//   },
//   "ST (Civil Engineering)": {
//     "Civil Engineering": {
//       "Materials in Civil Engineering": {
//         commonSubjects: ["RDM 1 and RDM 2"],
//         specialtySubjects: ["Mineral Binders, Special Construction Materials, Durability of Materials"]
//       }
//     }
//   },
//   "Mechanical Engineering": {
//     "Energy": {
//       commonSubjects: ["Numerical Methods"],
//       specialtySubjects: ["Fluid Mechanics and Heat Transfer"]
//     },
//     "Mechanical Engineering and Materials": {
//       commonSubjects: ["Numerical Methods"],
//       specialtySubjects: ["Finite Element Methods and Composite Materials"]
//     }
//   },
//   "Metallurgy": {
//     "Metallurgical Engineering": {
//       commonSubjects: ["Physical Metallurgy 1"],
//       specialtySubjects: ["Phase Transformations"]
//     }
//   },
//   "Electrical Engineering": {
//     "Electrical Control": {
//       commonSubjects: ["Advanced Power Electronics"],
//       specialtySubjects: ["Advanced Electrical Machines"]
//     }
//   },
//   "Process Engineering": {
//     "Chemical Engineering": {
//       commonSubjects: ["Chemical Thermodynamics"],
//       specialtySubjects: ["Unit Operations"]
//     },
//     "Environmental Process Engineering": {
//       commonSubjects: ["Chemical Thermodynamics"],
//       specialtySubjects: ["Management and Treatment of Water, Sludge, and Waste"]
//     }
//   },
//   "SHS (Psychology)": {
//     "Psychology": {
//       "Work and Organizational Psychology": {
//         commonSubjects: ["Scientific Research Methodology"],
//         specialtySubjects: ["Organizational Behavior"]
//       }
//     }
//   },
//   "DSP (Law)": {
//     "Law": {
//       "قانون الاسرة": {
//         commonSubjects: ["مدخل للعلوم القانونية"],
//         specialtySubjects: ["قضايا أسرية"]
//       },
//       "قانون الاعمال": {
//         commonSubjects: ["مدخل للعلوم القانونية"],
//         specialtySubjects: ["قانون المنافسة و الممارسات التجارية"]
//       },
//       "قانون مدني": {
//         commonSubjects: ["مدخل للعلوم القانونية"],
//         specialtySubjects: ["تطبيقات الدعوى الادارية"]
//       },
//       "قانون دولي": {
//         commonSubjects: ["مدخل للعلوم القانونية"],
//         specialtySubjects: ["المسؤولية الدولية"]
//       },
//       "قانون اداري": {
//         commonSubjects: ["مدخل للعلوم القانونية"],
//         specialtySubjects: ["قانون حماية المستهلك"]
//       }
//     }
//   }
// };

// const CascadingSelects = ({ onChange }) => {
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSpecialty, setSelectedSpecialty] = useState('');
//   const [selectedSubjectType, setSelectedSubjectType] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');

//   // Memoize helper functions
//   const getDepartments = useCallback(() => {
//     return selectedBranch ? Object.keys(treeData[selectedBranch]) : [];
//   }, [selectedBranch]);

//   const getSpecialties = useCallback(() => {
//     if (!selectedBranch || !selectedDepartment) return [];
//     const dept = treeData[selectedBranch][selectedDepartment];
//     return dept.commonSubjects ? [] : Object.keys(dept);
//   }, [selectedBranch, selectedDepartment]);

//   const getSubjects = useCallback(() => {
//     if (!selectedBranch || !selectedDepartment) return { common: [], specialty: [] };
    
//     const dept = treeData[selectedBranch][selectedDepartment];
//     if (dept.commonSubjects) {
//       return {
//         common: dept.commonSubjects,
//         specialty: dept.specialtySubjects
//       };
//     }
    
//     if (selectedSpecialty) {
//       return {
//         common: dept[selectedSpecialty].commonSubjects,
//         specialty: dept[selectedSpecialty].specialtySubjects
//       };
//     }
    
//     return { common: [], specialty: [] };
//   }, [selectedBranch, selectedDepartment, selectedSpecialty]);

//   // Memoize the selections object
//   const selections = useCallback(() => ({
//     branch: selectedBranch,
//     department: selectedDepartment,
//     specialty: selectedSpecialty,
//     subjectType: selectedSubjectType,
//     subject: selectedSubject
//   }), [selectedBranch, selectedDepartment, selectedSpecialty, selectedSubjectType, selectedSubject]);

//   // Update parent component only when selections actually change
//   useEffect(() => {
//     onChange(selections());
//   }, [onChange, selections]);

//   const handleBranchChange = (e) => {
//     setSelectedBranch(e.target.value);
//     setSelectedDepartment('');
//     setSelectedSpecialty('');
//     setSelectedSubjectType('');
//     setSelectedSubject('');
//   };

//   const handleDepartmentChange = (e) => {
//     setSelectedDepartment(e.target.value);
//     setSelectedSpecialty('');
//     setSelectedSubjectType('');
//     setSelectedSubject('');
//   };

//   const handleSpecialtyChange = (e) => {
//     setSelectedSpecialty(e.target.value);
//     setSelectedSubjectType('');
//     setSelectedSubject('');
//   };

//   const handleSubjectTypeChange = (e) => {
//     setSelectedSubjectType(e.target.value);
//     setSelectedSubject('');
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Branch</label>
//         <select
//           value={selectedBranch}
//           onChange={handleBranchChange}
//           className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//         >
//           <option value="">Select Branch</option>
//           {Object.keys(treeData).map(branch => (
//             <option key={branch} value={branch}>{branch}</option>
//           ))}
//         </select>
//       </div>

//       {selectedBranch && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={handleDepartmentChange}
//             className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//           >
//             <option value="">Select Department</option>
//             {getDepartments().map(dept => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {selectedDepartment && getSpecialties().length > 0 && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Specialty</label>
//           <select
//             value={selectedSpecialty}
//             onChange={handleSpecialtyChange}
//             className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//           >
//             <option value="">Select Specialty</option>
//             {getSpecialties().map(specialty => (
//               <option key={specialty} value={specialty}>{specialty}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {((selectedDepartment && getSubjects().common.length > 0) || 
//         (selectedSpecialty && getSubjects().common.length > 0)) && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Subject Type</label>
//           <select
//             value={selectedSubjectType}
//             onChange={handleSubjectTypeChange}
//             className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//           >
//             <option value="">Select Subject Type</option>
//             <option value="common">Common Subjects</option>
//             <option value="specialty">Specialty Subjects</option>
//           </select>
//         </div>
//       )}

//       {selectedSubjectType && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Subject</label>
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//           >
//             <option value="">Select Subject</option>
//             {getSubjects()[selectedSubjectType].map(subject => (
//               <option key={subject} value={subject}>{subject}</option>
//             ))}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// };

// const DocumentFilterList = () => {
//   const [selections, setSelections] = useState({
//     branch: '',
//     department: '',
//     specialty: '',
//     subjectType: '',
//     subject: ''
//   });
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Memoize the selection change handler
//   const handleSelectionChange = useCallback((newSelections) => {
//     setSelections(newSelections);
//   }, []);

//   const fetchFilteredDocuments = async () => {
//     try {
//       setLoading(true);
      
// // Option 1: If newRequest is axios
// const response = await newRequest.get(`${BASE_URL}admin/contributions`, {
//   params: {
//     branch: selections.branch,
//     department: selections.department,
//     specialty: selections.specialty,
//     subjectType: selections.subjectType,
//     subject: selections.subject,
//     page: 1,
//     limit: 10
//   }
// });
// // With axios, response.data is already parsed
// const data = response.data;

// console.log('data ',data);
      
//       if (response.status== 200) {
//         console.log("OKK !!!!")
//         setDocuments(data);
//       } else {
//         console.error('Failed to fetch documents');
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="p-4 bg-white rounded-lg shadow">
//         <CascadingSelects onChange={handleSelectionChange} />
//         <div className="mt-4">
//           <Button 
//             onClick={fetchFilteredDocuments}
//             disabled={loading || !selections.branch || !selections.department || !selections.subject}
//             className="w-full"
//           >
//             {loading ? 'Loading...' : 'Search Documents'}
//           </Button>
//         </div>
//       </div>

//       <div className="space-y-4">
//       {documents.map((doc) => (
//         <Card key={doc._doc._id} className="hover:shadow-lg transition-shadow">
//           <CardContent className="p-4">
//             <div className="flex items-start justify-between">
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <FileText className="w-5 h-5 text-blue-500" />
//                   <h3 className="font-medium">{doc._doc.name}</h3>
//                 </div>

//                 {/* Extract relevant data from nested object structure */}
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <User className="w-4 h-4" />
//                   <span>{doc.contributions[0].name.split(' ')[0]}</span>  {/* Assuming name is in "First Last" format */}
//                 </div>

//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Calendar className="w-4 h-4" />
//                   <span>
//                     {new Date(doc.contributions[0].createdAt).toLocaleDateString()}
//                   </span>
//                 </div>

//                 {doc.contributions[0].note && (
//                   <p className="text-sm text-gray-600">{doc.contributions[0].note}</p>
//                 )}
//               </div>

//               <a
//                 href={doc.contributions[0].cloudinaryUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
//               >
//                 View Document
//               </a>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
  
        
//         {documents.length === 0 && !loading && (
//           <div className="text-center py-8 text-gray-500">
//             No documents found matching your criteria
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DocumentFilterList;