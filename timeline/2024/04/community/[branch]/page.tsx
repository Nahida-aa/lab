// src/app/[username]/[reponame]/upload/[branch]/page.tsx
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { File} from 'lucide-react';

const UploadPage = ({ params }: { params: { username: string, reponame: string, branch: string } }) => {
  const { username, reponame, branch } = params;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // 这里你可以添加上传文件的逻辑，例如调用 API
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // });

    console.log(`Uploading ${file.name} to ${username}/${reponame}/${branch}`);
    setUploading(false);
  };

  return (
    <main id="js-repo-pjax-container">
      <div className="max-w-[1280px] mx-auto mt-6 lg:px-8 md:px-6 px-4">
        <h1 className="sr-only">Uploading files to {reponame}</h1>

        {/* 路径式导航标题 */}
        <div className='text-base mb-4'>
          <h2 className="sr-only">Breadcrumbs</h2>
          <span >
            <span >
              <span className="inline-block wb-break-all">
                <a href={`/${username}/${reponame}/upload/${branch}`}>
                  <span>{reponame}</span>
                </a>
              </span>
            </span>
            <span className="mx-1">/</span>
          </span>
        </div>

        {/* 文件或文件夹上传框 */}
        <h2 className="sr-only">Upload files</h2>
        <div className="js-upload-manifest-file-container">
          <form data-turbo="false" action="/upload/upload-manifest-files" accept-charset="UTF-8" method="post">
            <div className="d-block mb-3 Box blankslate blankslate-spacious js-upload-manifest-file repo-file-upload-target"  data-upload-repository-id="863156143" data-directory-upload-max-files="100"  data-upload-policy-url="/upload/policies/upload-manifest-files">
                <div className="repo-file-upload-outline"></div>
                <File />
                <span className="repo-file-upload-text initial-text h2">Drag files here to add them to your repository</span>
                <span className="repo-file-upload-text alternate-text h2">Drag additional files here to add them to your repository</span>
                <span className="repo-file-upload-drop-text h2">Drop to upload your files</span>
                <p className="repo-file-upload-choose">
                  Or
                  <input type="file" multiple className="manual-file-chooser" id="upload-manifest-files-input" aria-label="Choose your files" onChange={handleFileChange} />
                  <span className="manual-file-chooser-text btn-link" aria-hidden="true" >choose your files</span>
                </p>
                <div className="repo-file-upload-errors">
                  <span className="error too-big">Yowza, that’s a big file. Try again with a file smaller than 25MB.</span>
                  <span className="error too-many">Yowza, that’s a lot of files. Try uploading fewer than 100 at a time.</span>
                  <span className="error empty">This file is empty.</span>
                  <span className="error hidden-file">This file is hidden.</span>
                  <span className="error failed-request">Something went really wrong, and we can’t process that file.</span>
                </div>
              </div>
          </form>
          <div className="mb-3 js-upload-progress" >
            <div className="mb-2 f4 js-upload-meter-text">
              <div className="d-flex flex-items-center mb-1">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="octicon octicon-file mr-2">
                  <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                </svg>
                <div className="js-upload-meter-filename"></div>
              </div>
              <div className="f6">Uploading <span className="js-upload-meter-range-start"></span> of <span className="js-upload-meter-range-end"></span> files</div>
              </div>
              <div className="Progress Progress--large">
                <span className="color-bg-success-emphasis js-upload-meter" style={{ width: '0%' }}></span>
              </div>
            </div>
          </div>

          {/* commit changes 表单 */}
          <form className="file-commit-form manifest-commit-form js-file-commit-form js-manifest-commit-form" data-turbo="false" action="/Nahida-aa/chat-nextjs/upload" acceptCharset="UTF-8" method="post">
            <input type="hidden" name="authenticity_token" value="Kcq9m2WyBtsYb4p5Ods4vqub2eXZC7QVaFmo1nO4KNbGw90pGwSlxuaTiGFtj5eIY6PxtJzIEm-edewIBoWeZA" />
            <img className="commit-form-avatar float-left rounded-full" src="https://avatars.githubusercontent.com/u/96083926?s=96&amp;v=4" width="48" height="48" alt="@Nahida-aa" />

            <div className="commit-form relative p-3 mb-2 border rounded-2">
              <h3>Commit changes</h3>

              <div className="text-red-600 js-too-long-error hidden">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon octicon-light-bulb">
                  <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
                </svg>
                <strong>ProTip!</strong> Great commit summaries contain fewer than 50 characters. Place extra information in the extended description.
              </div>

              <label htmlFor="commit-summary-input" className="sr-only">
                Commit summary
              </label>
              <input id="commit-summary-input" type="text" className="form-control input-block input-contrast js-new-blob-commit-summary js-quick-submit" placeholder="Add files via upload" autoComplete="off" name="message" />

              <label htmlFor="commit-description-textarea" className="sr-only">
                Optional extended description
              </label>
              <textarea id="commit-description-textarea" name="description" className="form-control input-block input-contrast comment-form-textarea js-quick-submit" placeholder="Add an optional extended description…"></textarea>

              <div className="form-group mb-0" role="radiogroup" aria-label="Commit choice">
                <div className="form-checkbox pl-4 mt-0 mb-2">
                  <label className="text-normal">
                    <input type="radio" className="js-quick-pull-choice-option" name="commit-choice" value="direct" autoComplete="off" defaultChecked />
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon octicon-git-commit text-gray-500 mr-1 text-center">
                      <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
                    </svg>
                    Commit directly to the <strong className="branch-name">main</strong> branch.
                  </label>
                </div>
                <div className="form-checkbox pl-4 my-0">
                  <label className="text-normal" aria-live="polite">
                    <input type="radio" className="form-checkbox-details-trigger js-quick-pull-choice-option" name="commit-choice" value="quick-pull" autoComplete="off" />
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon octicon-git-pull-request text-gray-500 mr-1 text-center">
                      <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path>
                    </svg>
                    Create a <strong>new branch</strong> for this commit and start a pull request.
                    <a className="text-blue-600" href="https://docs.github.com/articles/using-pull-requests" target="_blank" rel="noreferrer">
                      Learn more about pull requests.
                    </a>

                    <div className="form-checkbox-details mt-2">
                      <div className="relative mt-2">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="octicon octicon-git-branch text-gray-500 text-center absolute">
                          <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path>
                        </svg>
                        <input type="text" value="Nahida-aa-patch-1" className="form-control input-contrast mr-1 pl-5 input-monospace js-quick-pull-new-branch-name" placeholder="New branch name" aria-label="New branch name" aria-describedby="quick-pull-normalization-info" data-generated-branch="Nahida-aa-patch-1" data-check-url="https://github.com/Nahida-aa/chat-nextjs/ref_check" />
                        <input type="hidden" value="K0gihUWDWosIBFv_5bkppAvwPRKjreiUgeGySVsrkn8zrxHA8rtIHK8T_zGDv-w8CnCgM9NsZBLXmqWT8LD8cA" data-csrf="true" className="js-data-check-url-csrf" />
                        <span className="text-gray-500 js-quick-pull-normalization-info" id="quick-pull-normalization-info"></span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <input type="hidden" name="target_branch" className="js-quick-pull-target-branch" value="main" data-default-value="main" autoComplete="off" />
              <input type="hidden" name="quick_pull" className="js-quick-pull-choice-value" value="main" autoComplete="off" />

              <input type="hidden" name="manifest_id" />
            </div>

            <button data-edit-text="Commit changes" data-pull-text="Propose changes" type="submit" className="js-blob-submit btn btn-primary">
              Commit changes
            </button>
            <a className="btn btn-danger" href="/Nahida-aa/chat-nextjs">Cancel</a>
          </form>
      </div>
    </main>
  );
};

export default UploadPage;