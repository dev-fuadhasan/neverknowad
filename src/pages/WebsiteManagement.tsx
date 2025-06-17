import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

interface Website {
  id: number;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

const WebsiteManagement = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [newWebsite, setNewWebsite] = useState({
    name: '',
    url: '',
  });

  // Mock data - In a real app, this would come from an API
  useEffect(() => {
    setWebsites([
      {
        id: 1,
        name: 'Example Site 1',
        url: 'https://example1.com',
        status: 'active',
        lastUpdated: '2024-02-20',
      },
      {
        id: 2,
        name: 'Example Site 2',
        url: 'https://example2.com',
        status: 'inactive',
        lastUpdated: '2024-02-19',
      },
    ]);
  }, []);

  const handleAddWebsite = () => {
    // In a real app, this would make an API call
    const newWebsiteWithId = {
      id: websites.length + 1,
      name: newWebsite.name,
      url: newWebsite.url,
      status: 'active' as const,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setWebsites([...websites, newWebsiteWithId]);
    setIsAddModalOpen(false);
    setNewWebsite({ name: '', url: '' });
  };

  const handleEditWebsite = (website: Website) => {
    setSelectedWebsite(website);
    setIsEditModalOpen(true);
  };

  const handleDeleteWebsite = (websiteId: number) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      setWebsites(websites.filter(website => website.id !== websiteId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Website
        </button>
      </div>

      {/* Websites Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">URL</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Last Updated</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {websites.map((website) => (
              <tr key={website.id} className="border-b">
                <td className="px-6 py-4">{website.id}</td>
                <td className="px-6 py-4">{website.name}</td>
                <td className="px-6 py-4">
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    {website.url}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      website.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {website.status}
                  </span>
                </td>
                <td className="px-6 py-4">{website.lastUpdated}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditWebsite(website)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWebsite(website.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Website Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Website</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWebsite}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Website Modal */}
      {isEditModalOpen && selectedWebsite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Website</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedWebsite.name}
                  onChange={(e) =>
                    setSelectedWebsite({ ...selectedWebsite, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={selectedWebsite.url}
                  onChange={(e) =>
                    setSelectedWebsite({ ...selectedWebsite, url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedWebsite.status}
                  onChange={(e) =>
                    setSelectedWebsite({
                      ...selectedWebsite,
                      status: e.target.value as 'active' | 'inactive',
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setWebsites(
                    websites.map((website) =>
                      website.id === selectedWebsite.id ? selectedWebsite : website
                    )
                  );
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteManagement; 