"use client";

import { useEffect, useState } from "react";
import { FileArchive, FileText, Plus, Loader2, LucideDownload, LucideScanEye, LucideTrash2, LucideImage, LucideLink, SquareArrowOutUpRight, LucideCopy, LucideCopyCheck, LucideLoader } from "lucide-react";
import toast from "react-hot-toast";

function AssetsCard({ imageLink, userImage, url, title, author, viewLink, handleDelete, type, createdAt }: {
  imageLink: string,
  title: string,
  author: string,
  url?: string,
  userImage: string,
  viewLink: () => void,
  handleDelete: () => void,
  type: string
  createdAt: string
}) {

  const [isCopied, setIsCopied] = useState(false);
  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    }
  };


  const getIcon = (type: string) => {
    if (type === "image") return <LucideImage className="text-gray-400" size={16} />;
    if (type === "zip") return <FileArchive className="text-gray-400" size={16} />;
    if (type === "link") return <LucideLink className="text-gray-400" size={16} />
    return <FileText className="text-gray-400" size={16} />;
  };

  const copyTextToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative w-100 h-80 rounded-4xl border-8 border-black dark:border-gray-700 overflow-hidden">
      <img
        src={type === "link" ? "appConfig.logo" : imageLink}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 w-full h-2/3 overflow-hidden">
        <svg
          viewBox="0 0 500 242"
          preserveAspectRatio="xMidYMid meet"
          className="
      min-w-full min-h-full
      fill-black dark:fill-gray-700
    "
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 30C0 13.4315 13.4315 0 30 0H149.076C154.27 0 159.374 1.34832 163.89 3.91303L221.11 36.4071C225.626 38.9718 230.73 40.3202 235.924 40.3202H470C486.569 40.3202 500 53.7516 500 70.3202V214C500 230.569 486.569 244 470 244H30C13.4315 244 0 230.569 0 214V30Z" />
        </svg>
        <div className="w-full h-full absolute inset-0 px-6 py-3">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg mb-3 flex justify-start items-center gap-1">{getIcon(type)} {type}</p>
          <p className="text-white dark:text-white font-medium text-xl">{title}</p>
          <p className="text-gray-400 font-normal text-xs mt-2">Uploaded on: {createdAt?.split("T")[0]}</p>

          <div className="w-full absolute bottom-4 flex justify-between items-center">
            <div className="flex justify-center items-center gap-2 rounded-full  text-sm">
              <div className="w-6 h-6 overflow-hidden  rounded-full flex justify-center items-center bg-blue-500/20 text-blue-400 border border-blue-400">
                {
                  userImage ? (
                    <img
                      src={userImage}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <p>{author ? author?.charAt(0) : "A"}</p>
                  )
                }
              </div>
              <p className="text-gray-400">
                {author || "ADMIN"}
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 pr-12">
              <div onClick={handleDelete} className="cursor-pointer w-6 h-6 text-white hover:text-red-400 flex justify-center items-center rounded-full">
                <LucideTrash2 size={20} strokeWidth={2} />
              </div>
              <div onClick={() => {
                if (type === "link") {
                  if (url) copyTextToClipboard(url);
                } else {
                  viewLink();
                }
              }} className="cursor-pointer w-8 h-8 text-white hover:text-blue-400 flex justify-center items-center rounded-full">
                {type === "link" ? isCopied ? <LucideCopyCheck size={20} strokeWidth={2} /> : <LucideCopy size={20} strokeWidth={2} /> : <LucideScanEye size={20} strokeWidth={2} />}
              </div>
              <div onClick={type === "link" ? () => {
                try {
                  let fullUrl = url?.trim() || "";
                  if (fullUrl && !fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
                    fullUrl = 'https://' + fullUrl;
                  }
                  if (fullUrl) {
                    new URL(fullUrl); // Validate URL
                    window.open(fullUrl, "_blank");
                  }
                } catch (error) {
                  console.error('Invalid URL:', url);
                  if (url) window.open(url, "_blank");
                }
              } : () => handleDownload(imageLink, title)} className="cursor-pointer w-8 h-8 bg-white dark:bg-black hover:scale-90 hover:bg-green-400 transition-all flex justify-center items-center rounded-full">
                {type === "link" ? <SquareArrowOutUpRight size={14} strokeWidth={2.5} /> : <LucideDownload size={14} strokeWidth={2.5} />}
              </div>

            </div>
          </div>
        </div>

      </div>


    </div>
  )
}

export default function AssetsTab({ projectId }: { projectId: string }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [clientAssetsOpen, setClientAssetsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("image");
  const [clientAssetType, setClientAssetType] = useState("design");
  const [clientPreviewType, setClientPreviewType] = useState("image");
  const [title, setTitle] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [clientFile, setClientFile] = useState<File | null>(null);
  const [clientLiveUrl, setClientLiveUrl] = useState("");
  const [user, setUser] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);


  const checkUserRole = async () => {
    try {
      const response = localStorage.getItem("user");
      // const response = await fetch('/api/user');
      // const data = await response.json();
      const data = response ? JSON.parse(response) : null;
      // if (data.user && data.user.role === 'ADMIN') {
      //   setImage(data.user.image);
      //   setUser(data.user.name);
      //   setIsAdmin(true);
      // }
      if (data && data?.SubRole?.role?.name === 'ADMIN') {
        setImage(data.image);
        setUser(data.name);
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Failed to check user role:', error);
    }
  };

  useEffect(() => {
    checkUserRole();
    fetchClientId();
    fetchAssets();
  }, [projectId]);

  const fetchClientId = async () => {
    try {
      const response = await fetch(`/api/project/${projectId}`);
      const data = await response.json();
      if (data.success && data.project.members) {
        const clientMember = data.project.members.find((member: any) => member.user.role === 'CLIENT');
        if (clientMember) {
          setClientId(clientMember.user.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch client ID:', error);
    }
  };



  const uploadClientAsset = async () => {
    if (!clientTitle) {
      toast.error("Please provide a title");
      return;
    }

    if (clientPreviewType === "link" && !clientLiveUrl) {
      toast.error(`Please provide a ${clientAssetType === "design" ? "design" : "live"} URL`);
      return;
    }

    if (clientPreviewType !== "link" && !clientFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("type", clientAssetType);
    formData.append("previewType", clientPreviewType);
    formData.append("title", clientTitle);
    formData.append("uploadedBy", user);

    if (clientFile) {
      formData.append("file", clientFile);
    }

    if (clientLiveUrl) {
      formData.append("liveUrl", clientLiveUrl);
    }

    try {
      setUploading(true);
      const res = await fetch("/api/client/analytics/design-preview", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setClientAssetsOpen(false);
        setClientFile(null);
        setClientTitle("");
        setClientLiveUrl("");
        setClientAssetType("design");
        setClientPreviewType("image");
        await fetchAssets();
        toast.success("Client asset uploaded successfully!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch(`/api/project/assets?projectId=${projectId}`);
      const data = await res.json();

      if (data.success) setAssets(data.assets);
    } catch (err) {
      console.error("Asset fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async () => {

    if (!title) {
      toast.error("Please Give a title");
      return;
    }

    // Validate based on type
    if (type === "link" && !url) {
      toast.error("Please provide a URL for the link");
      return;
    }

    if (type !== "link" && !file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("type", type);
    formData.append("title", title);
    formData.append("uploadedBy", user);
    formData.append("userImage", image);

    // Only append file if it's not a link type
    if (type === "link") {
      formData.append("url", url);
    } else {
      formData.append("file", file!);  // <-- UNCOMMENT AND FIX THIS
      formData.append("url", "");  // Send empty string for non-link types
    }

    try {
      setUploading(true);
      const res = await fetch("/api/project/assets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setOpen(false);
        setFile(null);
        setTitle("");
        setUrl("");  // Also reset URL
        await fetchAssets();
        toast.success("Asset uploaded successfully!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const res = await fetch('/api/project/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchAssets();
        toast.success('Asset deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete asset');
      }
    } catch (error) {
      toast.error('Failed to delete asset');
    }
  };


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Assets</h2>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Upload Asset
            </button>

            {clientId && (
              <button
                onClick={() => setClientAssetsOpen(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                <Plus size={18} /> Client Assets
              </button>
            )}
          </div>
        )}

      </div>

      {/* EMPTY STATE */}
      {loading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <LucideLoader className='animate-spin text-blue-300' size={40} />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No assets uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-25">
          {
            assets.length > 0 ? assets.map((a) => (
              <AssetsCard key={a.id} imageLink={a.url} author={a.uploadedBy} userImage={a.userImage} viewLink={() => window.open(a.url, '_blank')} title={a.title} handleDelete={() => deleteAsset(a.id)} type={a.type} createdAt={a.createdAt} url={a.url} />
            )) : (
              <p className="text-center w-full">No Assets uploaded.</p>
            )
          }
        </div>

      )}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-100">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full border dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-white mb-4">
              Upload Asset
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4"
            />

            {/* Type */}
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Select Type
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-3"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="image">Image</option>
              <option value="zip">Zip</option>
              <option value="document">Document</option>
              <option value="link">Link</option>
            </select>

            {
              type === "link" ? (
                <>
                  <input
                    type="text"
                    placeholder="Paste Your URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 mt-2"
                  />
                </>
              ) : (
                <>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mb-3"
                  />
                </>
              )
            }


            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={uploading}
                onClick={uploadAsset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                {uploading && <Loader2 className="animate-spin" size={16} />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Assets Modal */}
      {clientAssetsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-100">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full border dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-white mb-4">
              Upload Client Asset
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={clientTitle}
              onChange={(e) => setClientTitle(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4"
            />

            <label className="text-sm text-gray-600 dark:text-gray-400">
              Asset Type
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-3"
              value={clientAssetType}
              onChange={(e) => setClientAssetType(e.target.value)}
            >
              <option value="design">Design</option>
              <option value="preview">Live Preview</option>
            </select>

            <label className="text-sm text-gray-600 dark:text-gray-400">
              {clientAssetType === "design" ? "Design Type" : "Preview Type"}
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-3"
              value={clientPreviewType}
              onChange={(e) => setClientPreviewType(e.target.value)}
            >
              <option value="image">Image</option>
              <option value="figma">Figma</option>
              <option value="link">{clientAssetType === "design" ? "Design Link" : "Live Link"}</option>
            </select>

            {clientPreviewType === "link" ? (
              <input
                type="text"
                placeholder="Live URL"
                value={clientLiveUrl}
                onChange={(e) => setClientLiveUrl(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4"
              />
            ) : (
              <input
                type="file"
                onChange={(e) => setClientFile(e.target.files?.[0] || null)}
                className="mb-3"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClientAssetsOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={uploading}
                onClick={uploadClientAsset}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
              >
                {uploading && <Loader2 className="animate-spin" size={16} />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}